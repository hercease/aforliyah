import Link from 'next/link'
import Dropdown from 'react-bootstrap/Dropdown'
export default function CurrencyDropdown() {
	return (
		<>
		<style>{`
			.currency_dropdown. dropdown-menu {
				padding-left: 10px;
				padding-right: 10px;
				z-index: 1100;
				-webkit-box-shadow: 0px 0px 40px rgba(29, 58, 83, 0.1);
				box-shadow: 0px 0px 40px rgba(29, 58, 83, 0.1);
			}
      `}</style>
			<Dropdown className="d-none d-lg-block box-dropdown-cart align-middle mr-15 currency_dropdown">
				<Dropdown.Toggle as="span" className="text-14-medium">
					<span className="text-14-medium arrow-down">NGN</span>
				</Dropdown.Toggle>
				<Dropdown.Menu className="dropdown-cart" style={{visibility: 'visible'}}>
					<ul>
						<li><Link className="text-sm-medium" href="#">NGN</Link></li>
						{/*<li><Link className="text-sm-medium" href="#">EUR</Link></li>
						<li><Link className="text-sm-medium" href="#">SGP</Link></li>*/}
					</ul>
				</Dropdown.Menu>
			</Dropdown>
		</>
	)
}
