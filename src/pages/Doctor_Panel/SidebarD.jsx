import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import FeatherIcon from "feather-icons-react";
import { useSidebarContext } from "../pages/api/useSidebarContext";
import logo from "/src/assets/images/logo/icon-logo.png";
import "font-awesome/css/font-awesome.min.css";

const menuPaths = {
  Dashboards: ["/index", "/doctor-dashboard", "/patient-dashboard"],
  Patient: [
      "/navbar",
      "/patient",
      "/personal",
      "/patientHistory",
      "/diagnosis",
      "/followUp",
      "/otherTests",
      "/opdPrescription",
      "/surgery",
      "/dischargeCard",
    ],
    ManageReports: [
      "/dailyOPDReport",
      "/birthdayAlert",
      "/appointmentConversion",
      "/billingReport",
      "/enquiryConversion",
      "/enquiryData",
      "/oPDCollectionReport",
      "/pharmacyCollectionReport",
      "/iPDCollectionReport",
      "/referenceReport",
      "/conditionWiseReport",
      "/sxConversionReport",
      "/iPDDueReport",
      "/insuranceDueReport",
      "/oPDIPDCollection",
      "/oPDIDCollGraph",
      "/oPDReceiptsReport",
    ],
};
export default function Sidebar() {
  // Sidebar Menu
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const category = Object.keys(menuPaths).find((key) =>
      menuPaths[key].includes(currentPath)
    );
    const index = category ? Object.keys(menuPaths).indexOf(category) : null;
    setActiveIndex(index);
  }, [location.pathname]);

  const handleMenuClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Sidebar Action
  const { toggleSidebar } = useSidebarContext();
  return (
    <div className="codex-sidebar">
      <div className="logo-gridwrap">
        <Link className="lightlogo" to="/">
          <img className="img-fluid" src={logo} alt="sidebar-lightlogo" />
          <span className="ms-2">HMS</span>
        </Link>
      </div>

      <SimpleBar className="codex-menu custom-scroll">
        <ul className="">
          <li className="cdxmenu-title">
            <h5>Main</h5>
          </li>

          <li
            onClick={() => handleMenuClick(0)}
            className={`menu-item ${activeIndex === 0 ? "active" : ""}`}
          >
            <Link>
              <div className="icon-item">
                <FeatherIcon icon="home" />
              </div>
              <span>Dashboard </span>
              <i className="fa fa-angle-down"></i>
            </Link>
            <ul className="submenu-list">
              <li>
                <Link to="/">Hospital Dashboard</Link>
              </li>
              <li>
                <Link to="/doctor-dashboard">Doctor Dashboard</Link>
              </li>
              <li>
                <Link to="/patient-dashboard">Patient Dashboard</Link>
              </li>
            </ul>
          </li>

          <li
            onClick={() => handleMenuClick(13)}
            className={`menu-item ${activeIndex === 13 ? "active" : ""}`}
          >
            <Link>
              <div className="icon-item">
                <FeatherIcon icon="men" />
              </div>
              <span>Patient</span>
              <i className="fa fa-angle-down"></i>
            </Link>
            <ul className="submenu-list">
              <li>
                <Link to="/navbar">Navbar</Link>
              </li>
            </ul>
            <ul className="submenu-list">
              <li>
                <Link to="/patient">Patient</Link>
              </li>
            </ul>
            <ul className="submenu-list">
              <li>
                <Link to="/personal">Personal</Link>
              </li>
            </ul>
            <ul className="submenu-list">
              <li>
                <Link to="/patientHistory">Patient History</Link>
              </li>
            </ul>
            <ul className="submenu-list">
              <li>
                <Link to="/diagnosis">Diagnosis</Link>
              </li>
            </ul>
            <ul className="submenu-list">
              <li>
                <Link to="/followUp">Follow Up</Link>
              </li>
            </ul>
            <ul className="submenu-list">
              <li>
                <Link to="/otherTests">Other Tests</Link>
              </li>
            </ul>
            <ul className="submenu-list">
              <li>
                <Link to="/opdPrescription">OPD Prescription</Link>
              </li>
            </ul>
            <ul className="submenu-list">
              <li>
                <Link to="/surgery">Surgery Details</Link>
              </li>
            </ul>
            <ul className="submenu-list">
              <li>
                <Link to="/dischargeCard">Discharge Card</Link>
              </li>
            </ul>
          </li>
          <li
            onClick={() => handleMenuClick(12)}
            className={`menu-item ${activeIndex === 12 ? "active" : ""}`}
          >
            <Link>
              <div className="icon-item">
                <FeatherIcon icon="file-text" />
              </div>
              <span>manage reports</span>
              <i className="fa fa-angle-down"></i>
            </Link>
            <ul className="submenu-list">
              <li>
                <Link to="/dailyOPDReport">Daily OPD Report</Link>
              </li>
              <li>
                <Link to="/birthdayAlert">Birthday Alert</Link>
              </li>
              <li>
                <Link to="/appointmentConversion">Appointment Conversion</Link>
              </li>
              <li>
                <Link to="/enquiryConversion">Enquiry Conversion</Link>
              </li>
              <li>
                <Link to="/enquiryData">Enquiry Data</Link>
              </li>
              <li>
                <Link to="/oPDReceiptsReport">OPD Receipts Report</Link>
              </li>
              <li>
                <Link to="/oPDCollectionReport">OPD Collection Report</Link>
              </li>
              <li>
                <Link to="/pharmacyCollectionReport">
                  Pharmacy Collection Report
                </Link>
              </li>
              <li>
                <Link to="/iPDCollectionReport">IPD Collection Report</Link>
              </li>
              <li>
                <Link to="/referenceReport">Reference Report</Link>
              </li>
              <li>
                <Link to="/conditionWiseReport">Condition Wise Report</Link>
              </li>
              <li>
                <Link to="/sxConversionReport">Sx Conversion Report</Link>
              </li>
              <li>
                <Link to="/billingReport">Billing Report</Link>
              </li>
              <li>
                <Link to="/iPDDueReport">IPD Due Report</Link>
              </li>
              <li>
                <Link to="/insuranceDueReport">Insurance Due Report</Link>
              </li>
              <li>
                <Link to="/oPDIPDCollection">OPD + IPD Collection</Link>
              </li>
              <li>
                <Link to="/oPDIPDCollGraph">OPD + IPD Coll Graph</Link>
              </li>
            </ul>
          </li>
          </ul>
      </SimpleBar>
    </div>
  );
}
