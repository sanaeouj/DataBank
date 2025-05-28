import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const importMapping = {
  "First Name": "firstName",
  "Last Name": "lastName",
  "Title": "title",                
  "Seniority": "seniority",       
  "Departments": "departments",    
  "Mobile Phone": "mobilePhone",
  "Email": "email",               
  "company_companyid": "company.companyid",
  "Company": "company.company",
  "Company Email": "company.email",
  "Company Phone": "company.phone",
  "Employees": "company.employees",
  "Industry": "company.industry",
  "SEO Description": "company.seoDescription",
  "company_personalid": "company.personalid",
  "City": "geo.city",
  "Address": "geo.address",
  "State": "geo.state",
  "Country": "geo.country",
  "Latest Funding Date": "companyRevenue.latestFunding",
  "Latest Funding Amount": "companyRevenue.latestFundingAmount",
  "revenue_companyid": "companyRevenue.companyid",
  "LinkedIn": "social.linkedinUrl",
  "Facebook": "social.facebookUrl",
  "Twitter": "social.twitterUrl",
  "social_companyid": "social.companyid"
};
const normalizeKey = (key) => key.trim().replace(/\s+/g, ' ').toLowerCase();
const normalizedMapping = Object.fromEntries(
  Object.entries(importMapping).map(([k, v]) => [normalizeKey(k), v])
);
const API_BASE_URL = "https://databank-yndl.onrender.com";

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
      companyid: "",
      company: "",
      email: "",
      phone: "",
      employees: "",
      industry: "",
      seoDescription: "",
      personalid: ""
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
      companyid: ""
    },
    companyRevenue: {
      companyid: "",
      latestFunding: "",
      latestFundingAmount: "",
    },
  });

  const [fileData, setFileData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

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

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
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
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add client");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error adding client:", error);
      throw error;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      try {
        if (fileExtension === "csv") {
          Papa.parse(data, {
            header: true,
            complete: (results) => {
              console.log("Parsed CSV data:", results.data);
              setFileData(results.data.filter(row => Object.keys(row).length > 0));
            },
            error: (error) => {
              console.error("CSV parsing error:", error);
              alert("Error parsing CSV file. Please check the file format.");
            }
          });
        } else if (fileExtension === "xlsx" || fileExtension === "xls") {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          console.log("Parsed Excel data:", jsonData);
          setFileData(jsonData.filter(row => Object.keys(row).length > 0));
        } else {
          throw new Error("Unsupported file type");
        }
      } catch (error) {
        console.error("File processing error:", error);
        alert(`Error processing file: ${error.message}`);
      }
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };

    if (fileExtension === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleAddFile = async () => {
    if (fileData.length === 0) {
      alert("No data to add. Please upload a valid file.");
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const [index, client] of fileData.entries()) {
        try {
          let newClient = JSON.parse(JSON.stringify(formData));
          
      Object.entries(client).forEach(([csvKey, value]) => {
  const normKey = normalizeKey(csvKey);
  const formKey = normalizedMapping[normKey];
  if (!formKey) {
    console.warn('Clé non mappée CSV:', csvKey);
    return;
  }
  const keys = formKey.split('.');
  let current = newClient;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
});

          console.log(`Processing client ${index + 1}/${fileData.length}:`, newClient);

          if (!newClient.firstName || !newClient.lastName || !newClient.email || !newClient.company?.company) {
            console.warn(`Missing required fields for client ${index + 1}`);
            errorCount++;
            continue;
          }
    console.log("Client envoyé à l'API :", newClient);

          await addClientToDatabase(newClient);
          successCount++;
        } catch (error) {
          console.error(`Error processing client ${index + 1}:`, error);
          errorCount++;
        }
      }

      setFileData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error("Batch processing error:", error);
      alert(`❌ An error occurred during batch processing: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setFormData(prevState => {
      const newState = { ...prevState };
      let current = newState;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.company?.company) {
        throw new Error("Please fill in all required fields");
      }

      const response = await addClientToDatabase(formData);
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
          companyid: "",
          company: "",
          email: "",
          phone: "",
          employees: "",
          industry: "",
          seoDescription: "",
          personalid: ""
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
          companyid: ""
        },
        companyRevenue: {
          companyid: "",
          latestFunding: "",
          latestFundingAmount: "",
        },
      });
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\./g, " > ")
      .toLowerCase()
      .replace(/(^|\s)\w/g, (c) => c.toUpperCase());
  };

  return (
    <div style={{ display: "flex", width: "90vw", height: "100vh", backgroundColor: "#242424" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "50px", color: "#333", overflowY: "auto" }}>
        <h1 style={{ color: "#fff", marginBottom: "20px" }}>Add People</h1>

        <div style={formContainerStyle}>
          <h3 style={{ color: "#fff" }}>Import Clients from File</h3>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            style={{ fontSize: "16px", margin: "10px", color: "#fff" }}
            disabled={isProcessing}
            ref={fileInputRef}
          />
          <button 
            type="button" 
            style={isProcessing ? disabledButtonStyle : buttonStyle} 
            onClick={handleAddFile}
            disabled={isProcessing || fileData.length === 0}
          >
            {isProcessing ? "Processing..." : "Process File Data"}
          </button>
                   <p style={{ color: "#aaa", fontSize: "12px", marginTop: "10px" }}>
            Supported formats: CSV, Excel (.xlsx, .xls)
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formContainerStyle}>
          <h3 style={{ color: "#fff" }}>Personal Information</h3>
          <div style={containerStyle}>
            {["firstName", "lastName", "title", "seniority", "departments", "mobilePhone", "email"].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>{formatLabel(field)}*:</label>
                <input
                  style={inputStyle}
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={["firstName", "lastName", "email"].includes(field)}
                />
              </div>
            ))}
            <div style={inputContainerStyle}>
              <label style={labelStyle}>Email Status*:</label>
              <select
                style={{ ...inputStyle, appearance: "none", lineHeight: "normal" }}
                name="EmailStatus"
                value={formData.EmailStatus}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="Valid">Valid</option>
                <option value="Invalid">Invalid</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          <h3 style={{ color: "#fff" }}>Company Information</h3>
          <div style={containerStyle}>
            {["company", "email", "phone", "employees", "industry", "seoDescription"].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>
                  {formatLabel(field)}{field === "company" ? "*" : ""}:
                </label>
                <input
                  style={inputStyle}
                  type={field === "employees" ? "number" : "text"}
                  name={`company.${field}`}
                  value={formData.company[field] || ""}
                  onChange={handleChange}
                  required={field === "company"}
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
                  value={formData.geo[field] || ""}
                  onChange={handleChange}
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
                  type="url"
                  name={`social.${field}`}
                  value={formData.social[field] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <h3 style={{ color: "#fff" }}>Company Revenue Information</h3>
          <div style={containerStyle}>
            {["latestFunding", "latestFundingAmount"].map((field) => (
              <div style={inputContainerStyle} key={field}>
                <label style={labelStyle}>{formatLabel(field)}:</label>
                <input
                  style={inputStyle}
                  type={field === "latestFunding" ? "date" : "number"}
                  name={`companyRevenue.${field}`}
                  value={formData.companyRevenue[field] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            style={buttonStyle}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Add Client"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPeople;