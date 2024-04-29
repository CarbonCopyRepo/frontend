import { Navbar } from 'flowbite-react';

export default function NavBar() {
  return (
    <Navbar fluid className="absolute top-0 w-full bg-slate-800 top-0">
      <Navbar.Brand>
        <a href="/" className="mr-1">
          <img
            id="navbar_logo"
            src="images/favicon.svg"
            style={{ height: '30px', width: 'auto' }}
            alt="Logo"
          />
        </a>
        <a
          href="/"
          className="self-center whitespace-nowrap text-xl font-semibold hover:text-white text-white"
        >
          Carbon Copy
        </a>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="/analytics">Analytics</Navbar.Link>
        <Navbar.Link href="/consumption">Consumption</Navbar.Link>
        <Navbar.Link href="/emissions">Emissions</Navbar.Link>
        <Navbar.Link href="/forecasts">Forecasts</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
