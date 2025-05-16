import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const AddPeople = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    seniority: "",
    departments: "",
    mobilePhone: "",
    email: "",
    EmailStatus: "",
    company: {
      company: "",
      email: "",
      phone: "",
      employees: "",
      industry: "",
      seoDescription: "",
    },
    geo: {
      address: "",
      city: "",
      state: "",
      country: "",
    },
    social: {
      linkedinUrl: "",
      facebookUrl: "",
      twitterUrl: "",
    },
    companyRevenue: {
      companyid: "",
      companyName: "",
      annualRevenue: "",
      totalFunding: "",
      latestFunding: "",
      latestFundingAmount: "",
    },
  });

  const [fileData, setFileData] = useState([]);

  const inputStyle = {
    margin: "10px",
    width: "100%",
    height: "40px",
    padding: "10px",
    fontSize: "13px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#1e1e1e",
    color: "#fff",
  };

  const labelStyle = {
    fontSize: "13px",
    color: "#fff",
    marginBottom: "5px",
  };

  const containerStyle = {
    margin: "10px 0",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    alignItems: "center",
  };

  const inputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    margin: "20px",
    gap: "10px",
    fontSize: "13px",
  };

  const buttonStyle = {
    margin: "10px",
    padding: "10px",
    fontSize: "13px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const formContainerStyle = {
    backgroundColor: "#2c2c2c",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    margin: "10px 0",
  };

  const addClientToDatabase = async (client) => {
    try {
      const response = await fetch("http://localhost:3000/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      const responseData = await response.json();
      if (!response.ok) {
        alert(`⚠️ ${responseData.error || "Error while adding the client."}`);
      }
    } catch (error) {
      alert("❌ An error occurred while adding the client.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop();
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      if (fileExtension === "csv") {
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            setFileData(results.data);
          },
        });
      } else if (fileExtension === "xlsx") {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        setFileData(jsonData);
      } else {
        alert("Invalid file type! Please upload a CSV or XLSX file.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleAddFile = async () => {
    if (fileData.length === 0) {
      alert("No data to add. Please upload a valid file.");
      return;
    }
    try {
      for (const client of fileData) {
        const newClient = {
          firstName: client["First Name"] || "",
          lastName: client["Last Name"] || "",
          title: client.title || "",
          seniority: client.seniority || "",
          departments: client.departments || "",
          mobilePhone: client.mobilePhone || "",
          email: client.email || "",
          EmailStatus: client.EmailStatus || "",
          company: {
            company: client["companycompany"] || "",
            email: client.companyEmail || "",
            phone: client.companyPhone || "",
            employees: client.companyemployees || "",
            industry: client.companyindustry || "",
            seoDescription: client["companySEO Description"] || "",
          },
          geo: {
            address: client.geoaddress || "",
            city: client.geocity || "",
            state: client.geostate || "",
            country: client.geocountry || "",
          },
          social: {
            linkedinUrl: client["socialCompany Linkedin Url"] || "",
            facebookUrl: client["socialFacebook Url"] || "",
            twitterUrl: client["socialTwitter Url"] || "",
          },
          companyRevenue: {
            companyid: "",
            companyName: client["companycompany"] || "",
            annualRevenue: client["revenueAnnual Revenue"]
              ? parseFloat(client["revenueAnnual Revenue"])
              : 0,
            totalFunding: client["revenueTotal Funding"]
              ? parseFloat(client["revenueTotal Funding"])
              : 0,
            latestFunding: client["revenueLatest Funding"] || "",
            latestFundingAmount: client["revenueLatest Funding Amount"]
              ? parseFloat(client["revenueLatest Funding Amount"])
              : 0,
          },
        };
        if (
          !newClient.firstName ||
          !newClient.lastName ||
          !newClient.email ||
          !newClient.company.company
        ) {
          alert("⚠️ Please fill in all required fields for each client.");
          continue;
        }
        await addClientToDatabase(newClient);
      }
      alert("✅ All clients have been successfully added!");
      setFileData([]);
    } catch (error) {
      alert("❌ An error occurred while adding clients.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length > 1) {
      setFormData((prevState) => ({
        ...prevState,
        [keys[0]]: {
          ...prevState[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      const response = await fetch("http://localhost:3000/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("✅ Client successfully added!");
        setFormData({
          firstName: "",
          lastName: "",
          title: "",
          seniority: "",
          departments: "",
          mobilePhone: "",
          email: "",
          EmailStatus: "",
          company: {
            company: "",
            email: "",
            phone: "",
            employees: "",
            industry: "",
            seoDescription: "",
          },
          geo: {
            address: "",
            city: "",
            state: "",
            country: "",
          },
          social: {
            linkedinUrl: "",
            facebookUrl: "",
            twitterUrl: "",
          },
          companyRevenue: {
            companyid: "",
            companyName: "",
            annualRevenue: 0,
            totalFunding: 0,
            latestFunding: "",
            latestFundingAmount: "",
          },
        });
      } else {
        const errorData = await response.json();
        alert(`⚠️ ${errorData.error || "Error while adding the client."}`);
      }
    } catch (error) {
      alert("❌ An error occurred.");
    }
  };

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div
      style={{
        display: "flex",
        width: "90vw",
        height: "100vh",
        backgroundColor: "#242424",
      }}
    >
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "50px", color: "#333" }}>
        <h1 style={{ color: "#fff", marginBottom: "20px" }}>Add Client</h1>

        <div style={formContainerStyle}>
          <h3 style={{ color: "#fff" }}>Import Clients from File</h3>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            style={{ fontSize: "16px", margin: "10px" }}
          />
          <button type="button" style={buttonStyle} onClick={handleAddFile}>
            Process File Data
          </button>
          <p style={{ color: "#fff", fontSize: "14px", marginTop: "10px" }}>
            Supported formats: CSV, Excel (.xlsx)
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formContainerStyle}>
          <h3 style={{ color: "#fff" }}>Personal Information</h3>
          <div style={containerStyle}>
            {[
              "firstName",
              "lastName",
              "title",
              "seniority",
              "departments",
              "mobilePhone",
              "email",
            ].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>{formatLabel(field)}:</label>
                <input
                  style={inputStyle}
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div style={inputContainerStyle}>
              <label style={labelStyle}>Email Status:</label>
              <select
                style={{
                  ...inputStyle,
                  appearance: "none",
                  lineHeight: "normal",
                }}
                name="EmailStatus"
                value={formData.EmailStatus}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="Valid">Valid</option>
                <option value="Invalid">Invalid</option>
              </select>
            </div>
          </div>

          <h3 style={{ color: "#fff" }}>Company Information</h3>
          <div style={containerStyle}>
            {[
              "company",
              "email",
              "phone",
              "employees",
              "industry",
              "seoDescription",
            ].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>{formatLabel(field)}:</label>
                <input
                  style={inputStyle}
                  type={field === "employees" ? "number" : "text"}
                  name={`company.${field}`}
                  value={formData.company[field] || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <h3 style={{ color: "#fff" }}>Geolocation</h3>
          <div style={containerStyle}>
            {["address", "city", "state", "country"].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>{formatLabel(field)}:</label>
                <input
                  style={inputStyle}
                  type="text"
                  name={`geo.${field}`}
                  value={formData.geo[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <h3 style={{ color: "#fff" }}>Social Media</h3>
          <div style={containerStyle}>
            {["linkedinUrl", "facebookUrl", "twitterUrl"].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>
                  {formatLabel(field.replace("Url", " URL"))}:
                </label>
                <input
                  style={inputStyle}
                  type="text"
                  name={`social.${field}`}
                  value={formData.social[field]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <h3 style={{ color: "#fff" }}>Company Revenue Information</h3>
          <div style={containerStyle}>
            {[
              "companyName",
              "annualRevenue",
              "totalFunding",
              "latestFunding",
              "latestFundingAmount",
            ].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>{formatLabel(field)}:</label>
                <input
                  style={inputStyle}
                  type={
                    field === "latestFunding"
                      ? "date"
                      : [
                          "annualRevenue",
                          "totalFunding",
                          "latestFundingAmount",
                        ].includes(field)
                      ? "number"
                      : "text"
                  }
                  name={`companyRevenue.${field}`}
                  value={formData.companyRevenue[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <button type="submit" style={buttonStyle}>
            Add Client
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPeople;
