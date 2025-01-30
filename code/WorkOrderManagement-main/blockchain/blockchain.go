// blockchain.go
package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"math/big"
	"time"
)

type Block struct {
	Timestamp     int64
	Data          []byte
	PrevBlockHash []byte
	Hash          []byte
	Nonce         int
}

type Blockchain struct {
	blocks []*Block
}

type WorkOrder struct {
	ID                 string
	Issuer             string
	Department         string
	Date               time.Time
	ImplementationDate time.Time
	Circular           string
	Status             string
	Approvals          []Approval
}

type Certificate struct {
	ID        string
	Recipient string
	Issuer    string
	Date      time.Time
	Details   string
}

type Approval struct {
	ApproverID string
	Status     string
	Date       time.Time
}

type Auction struct {
	ID        string
	Item      string
	StartTime time.Time
	EndTime   time.Time
	Bids      []Bid
}

type Bid struct {
	BidderID  string    `json:"bidderID,omitempty"`
	Amount    float64   `json:"amount"`
	Time      time.Time `json:"time,omitempty"`
	AuctionID string    `json:"auctionID,omitempty"`
}

func (b *Block) SetHash() {
	headers := append(b.PrevBlockHash, b.Data...)
	headers = append(headers, []byte(fmt.Sprintf("%d", b.Timestamp))...)
	headers = append(headers, []byte(fmt.Sprintf("%d", b.Nonce))...)
	hash := sha256.Sum256(headers)
	b.Hash = hash[:]
}

func NewBlock(data []byte, prevBlockHash []byte) *Block {
	block := &Block{time.Now().Unix(), data, prevBlockHash, []byte{}, 0}
	block.SetHash()
	return block
}

func (bc *Blockchain) AddBlock(data []byte) {
	prevBlock := bc.blocks[len(bc.blocks)-1]
	newBlock := NewBlock(data, prevBlock.Hash)
	bc.blocks = append(bc.blocks, newBlock)
}

func NewBlockchain() *Blockchain {
	return &Blockchain{[]*Block{NewGenesisBlock()}}
}

func NewGenesisBlock() *Block {
	return NewBlock([]byte("Genesis Block"), []byte{})
}

func (bc *Blockchain) AddWorkOrder(workOrderData []byte) (string, error) {
	var workOrder WorkOrder
	err := json.Unmarshal(workOrderData, &workOrder)
	if err != nil {
		return "", err
	}

	workOrder.ID = generateID()
	workOrder.Date = time.Now()
	workOrder.Status = "Pending"

	// Set the Date for each Approval if not already set
	for i := range workOrder.Approvals {
		if workOrder.Approvals[i].Date.IsZero() {
			workOrder.Approvals[i].Date = time.Now()
		}
	}

	updatedWorkOrderData, err := json.Marshal(workOrder)
	if err != nil {
		return "", err
	}
	bc.AddBlock(updatedWorkOrderData)
	return workOrder.ID, nil
}

func (bc *Blockchain) GetWorkOrder(id string) (*WorkOrder, error) {
	for _, block := range bc.blocks {
		var workOrder WorkOrder
		err := json.Unmarshal(block.Data, &workOrder)
		if err == nil && workOrder.ID == id {
			return &workOrder, nil
		}
	}
	return nil, fmt.Errorf("work order not found")
}
func (bc *Blockchain) UpdateWorkOrder(updatedWorkOrder WorkOrder) error {
	for i, block := range bc.blocks {
		var workOrder WorkOrder
		err := json.Unmarshal(block.Data, &workOrder)
		if err == nil && workOrder.ID == updatedWorkOrder.ID {
			// Ensure we're not overwriting fields that shouldn't change
			updatedWorkOrder.ID = workOrder.ID
			updatedWorkOrder.Issuer = workOrder.Issuer
			updatedWorkOrder.Department = workOrder.Department
			updatedWorkOrder.Date = workOrder.Date
			updatedWorkOrder.ImplementationDate = workOrder.ImplementationDate
			updatedWorkOrder.Circular = workOrder.Circular

			updatedWorkOrderData, err := json.Marshal(updatedWorkOrder)
			if err != nil {
				return err
			}
			newBlock := NewBlock(updatedWorkOrderData, bc.blocks[i-1].Hash)
			bc.blocks[i] = newBlock
			return nil
		}
	}
	return fmt.Errorf("work order not found")
}

func (bc *Blockchain) AddCertificate(cert Certificate) error {

	certData, err := json.Marshal(cert)
	if err != nil {
		return err
	}
	bc.AddBlock(certData)
	return nil
}

func (bc *Blockchain) GetCertificate(id string) (*Certificate, error) {
	for _, block := range bc.blocks {
		var cert Certificate
		err := json.Unmarshal(block.Data, &cert)
		if err == nil && cert.ID == id {
			return &cert, nil
		}
	}
	return nil, fmt.Errorf("certificate not found")
}

func (bc *Blockchain) StartAuction(auction Auction) error {
	// auction.ID = generateID()
	// auction.StartTime = time.Now()
	// if auction.EndTime.IsZero() {
	// 	auction.EndTime = auction.StartTime.Add(24 * time.Hour) // Default to 24 hours if not set
	// }
	for i := range auction.Bids {
		if auction.Bids[i].Time.IsZero() {
			auction.Bids[i].Time = time.Now()
		}
		if auction.Bids[i].BidderID == "" {
			auction.Bids[i].BidderID = fmt.Sprintf("initial-bidder-%d", i)
		}
		auction.Bids[i].AuctionID = auction.ID
	}

	auctionData, err := json.Marshal(auction)
	if err != nil {
		return err
	}
	bc.AddBlock(auctionData)
	return nil
}

func (bc *Blockchain) ParticipateInAuction(bid Bid) error {
	bid.Time = time.Now()
	if bid.BidderID == "" {
		bid.BidderID = generateID()
	}
	for i, block := range bc.blocks {
		var auction Auction
		err := json.Unmarshal(block.Data, &auction)
		if err == nil && auction.ID == bid.AuctionID {
			auction.Bids = append(auction.Bids, bid)
			updatedAuctionData, _ := json.Marshal(auction)
			bc.blocks[i] = NewBlock(updatedAuctionData, bc.blocks[i-1].Hash)
			return nil
		}
	}
	return fmt.Errorf("auction not found")
}

func (bc *Blockchain) GetAllWorkOrders() []WorkOrder {
	var workOrders []WorkOrder
	seenIDs := make(map[string]bool)

	// Iterate through the blocks in reverse order
	for i := len(bc.blocks) - 1; i >= 0; i-- {
		var workOrder WorkOrder
		err := json.Unmarshal(bc.blocks[i].Data, &workOrder)
		if err == nil && workOrder.ID != "" {
			if !seenIDs[workOrder.ID] {
				workOrders = append(workOrders, workOrder)
				seenIDs[workOrder.ID] = true
			}
		}
	}

	// Reverse the order of workOrders to maintain chronological order
	for i := 0; i < len(workOrders)/2; i++ {
		j := len(workOrders) - 1 - i
		workOrders[i], workOrders[j] = workOrders[j], workOrders[i]
	}

	return workOrders
}

func generateID() string {
	return fmt.Sprintf("%d", time.Now().UnixNano())
}

// Simulated Sign Protocol
type SimulatedSignProtocol struct {
	privateKey *ecdsa.PrivateKey
}

func NewSimulatedSignProtocol() (*SimulatedSignProtocol, error) {
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, err
	}
	return &SimulatedSignProtocol{privateKey: privateKey}, nil
}

func (s *SimulatedSignProtocol) Sign(data []byte) ([]byte, error) {
	r, ss, err := ecdsa.Sign(rand.Reader, s.privateKey, data)
	if err != nil {
		return nil, err
	}
	signature := append(r.Bytes(), ss.Bytes()...)
	return signature, nil
}

func (s *SimulatedSignProtocol) Verify(publicKey *ecdsa.PublicKey, data, signature []byte) bool {
	r := big.Int{}
	ss := big.Int{}
	r.SetBytes(signature[:len(signature)/2])
	ss.SetBytes(signature[len(signature)/2:])
	return ecdsa.Verify(publicKey, data, &r, &ss)
}

// Simulated Avail Client
type SimulatedAvailClient struct {
	peerID string
}

func NewSimulatedAvailClient() *SimulatedAvailClient {
	return &SimulatedAvailClient{peerID: generateRandomPeerID()}
}

func generateRandomPeerID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

func (a *SimulatedAvailClient) SimulateDataAvailability(data []byte) bool {
	return true
}
