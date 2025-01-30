// main.go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

var (
	blockchain   *Blockchain
	signProtocol *SimulatedSignProtocol
	availClient  *SimulatedAvailClient
)

func main() {
	var err error
	blockchain = NewBlockchain()
	signProtocol, err = NewSimulatedSignProtocol()
	if err != nil {
		log.Fatal(err)
	}
	availClient = NewSimulatedAvailClient()

	r := mux.NewRouter()

	r.HandleFunc("/add_work_order", addWorkOrder).Methods("POST")
	r.HandleFunc("/verify_work_order/{id}", verifyWorkOrder).Methods("GET")
	r.HandleFunc("/add_certificate", addCertificate).Methods("POST")
	r.HandleFunc("/verify_certificate/{id}", verifyCertificate).Methods("GET")
	r.HandleFunc("/start_auction", startAuction).Methods("POST")
	r.HandleFunc("/participate_auction", participateAuction).Methods("POST")
	r.HandleFunc("/view_auction/{id}", viewAuction).Methods("GET")
	r.HandleFunc("/approve_work_order/{id}", approveWorkOrder).Methods("POST")
	r.HandleFunc("/view_blockchain", viewBlockchain).Methods("GET")
	r.HandleFunc("/view_work_orders", viewWorkOrders).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// Use the CORS handler as middleware
	handler := c.Handler(r)
	fmt.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))

}

func addWorkOrder(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received a request to add a work order")
	var workOrder WorkOrder
	err := json.NewDecoder(r.Body).Decode(&workOrder)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	workOrderData, err := json.Marshal(workOrder)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	id, err := blockchain.AddWorkOrder(workOrderData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Fetch the updated work order from the blockchain
	updatedWorkOrder, err := blockchain.GetWorkOrder(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(updatedWorkOrder)
}

func verifyWorkOrder(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received a request to verify a work order")
	vars := mux.Vars(r)
	id := vars["id"]

	workOrder, err := blockchain.GetWorkOrder(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	workOrderData, _ := json.Marshal(workOrder)
	signature, _ := signProtocol.Sign(workOrderData)
	verified := signProtocol.Verify(&signProtocol.privateKey.PublicKey, workOrderData, signature)

	json.NewEncoder(w).Encode(map[string]bool{"verified": verified})
}

func addCertificate(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received a request to add a certificate")
	var certificate Certificate
	err := json.NewDecoder(r.Body).Decode(&certificate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	certificate.ID = generateID()
	certificate.Date = time.Now()

	err = blockchain.AddCertificate(certificate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(certificate)
}

func verifyCertificate(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received a request to verify a certificate")
	vars := mux.Vars(r)
	id := vars["id"]

	certificate, err := blockchain.GetCertificate(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	certificateData, _ := json.Marshal(certificate)
	signature, _ := signProtocol.Sign(certificateData)
	verified := signProtocol.Verify(&signProtocol.privateKey.PublicKey, certificateData, signature)

	json.NewEncoder(w).Encode(map[string]bool{"verified": verified})
}

func startAuction(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received a request to start an auction")
	var auction Auction

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	err := decoder.Decode(&auction)
	if err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}
	auction.ID = generateID()
	auction.StartTime = time.Now()
	if auction.EndTime.IsZero() {
		auction.EndTime = auction.StartTime.Add(24 * time.Hour)
	}

	err = blockchain.StartAuction(auction)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	auctionData, _ := json.Marshal(auction)
	if !availClient.SimulateDataAvailability(auctionData) {
		http.Error(w, "Failed to ensure data availability", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(auction)
}

func participateAuction(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received a request to participate in an auction")
	var bid Bid
	bid.BidderID = generateID()
	bid.Time = time.Now()
	err := json.NewDecoder(r.Body).Decode(&bid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = blockchain.ParticipateInAuction(bid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(bid)
}

func viewAuction(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received a request to view an auction")
	vars := mux.Vars(r)
	auctionID := vars["id"]

	var targetAuction Auction
	found := false

	for _, block := range blockchain.blocks {
		var auction Auction
		err := json.Unmarshal(block.Data, &auction)
		if err == nil && auction.ID == auctionID {
			targetAuction = auction
			found = true
			break
		}
	}

	if !found {
		http.Error(w, "Auction not found", http.StatusNotFound)
		return
	}

	// Sort bids by time
	sort.Slice(targetAuction.Bids, func(i, j int) bool {
		return targetAuction.Bids[i].Time.Before(targetAuction.Bids[j].Time)
	})

	type AuctionView struct {
		ID             string    `json:"id"`
		Item           string    `json:"item"`
		StartTime      time.Time `json:"startTime"`
		EndTime        time.Time `json:"endTime"`
		InitialBid     Bid       `json:"initialBid"`
		SubsequentBids []Bid     `json:"subsequentBids"`
	}

	auctionView := AuctionView{
		ID:        targetAuction.ID,
		Item:      targetAuction.Item,
		StartTime: targetAuction.StartTime,
		EndTime:   targetAuction.EndTime,
	}

	if len(targetAuction.Bids) > 0 {
		auctionView.InitialBid = targetAuction.Bids[0]
		auctionView.SubsequentBids = targetAuction.Bids[1:]
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(auctionView)
}

func approveWorkOrder(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received a request to approve a work order")
	vars := mux.Vars(r)
	id := vars["id"]

	var approval Approval
	err := json.NewDecoder(r.Body).Decode(&approval)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	workOrder, err := blockchain.GetWorkOrder(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	approval.Date = time.Now() // Set the approval date

	// Check if the approval already exists
	found := false
	for i, existingApproval := range workOrder.Approvals {
		if existingApproval.ApproverID == approval.ApproverID {
			workOrder.Approvals[i] = approval
			found = true
			break
		}
	}

	if !found {
		workOrder.Approvals = append(workOrder.Approvals, approval)
	}

	// Update the overall status of the work order
	workOrder.Status = updateWorkOrderStatus(workOrder.Approvals)

	// Update the work order in the blockchain
	err = blockchain.UpdateWorkOrder(*workOrder)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(workOrder)
}

func updateWorkOrderStatus(approvals []Approval) string {
	if len(approvals) == 0 {
		return "Pending"
	}

	allApproved := true
	for _, approval := range approvals {
		if approval.Status != "Approved" {
			allApproved = false
			break
		}
	}

	if allApproved {
		return "Approved"
	}

	return "Pending"
}

func viewBlockchain(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received a request to view the blockchain")
	type BlockView struct {
		Timestamp     int64  `json:"timestamp"`
		PrevBlockHash string `json:"prev_block_hash"`
		Hash          string `json:"hash"`
		Data          string `json:"data"`
	}

	var blockViews []BlockView

	for _, block := range blockchain.blocks {
		blockView := BlockView{
			Timestamp:     block.Timestamp,
			PrevBlockHash: fmt.Sprintf("%x", block.PrevBlockHash),
			Hash:          fmt.Sprintf("%x", block.Hash),
			Data:          string(block.Data),
		}
		blockViews = append(blockViews, blockView)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(blockViews)
}

func viewWorkOrders(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received a request to view work orders")
	workOrders := blockchain.GetAllWorkOrders()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(workOrders)
}

// func allApproved(approvals []Approval) bool {
// 	for _, approval := range approvals {
// 		if approval.Status != "Approved" {
// 			return false
// 		}
// 	}
// 	return true
// }
