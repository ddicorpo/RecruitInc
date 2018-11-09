import Link from 'next/link'
import * as React from 'react';

const linkStyle = {
  marginRight: 15
};

const Header = () => (
  <div>
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
      <Link href={"/profile"}>
          <a style={linkStyle}>Profile</a>
      </Link>
    <Link href={"/about"}>
      <a style={linkStyle}>About</a>
    </Link>
    <Link href={"/admin"}>
      <a style={linkStyle}>Admin</a>
    </Link>
      <Link href={"/hr"}>
          <a style={linkStyle}>hr</a>
      </Link>
  </div>
);

export default Header