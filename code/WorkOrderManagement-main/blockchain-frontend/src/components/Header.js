import React from 'react';

function Header() {
  return (
    <div className="flex justify-center mb-8">
      <img src={process.env.PUBLIC_URL + '/img/college.png'} alt="Logo" className="w-full max-w-[175px]" />
    </div>
  );
}

export default Header;
