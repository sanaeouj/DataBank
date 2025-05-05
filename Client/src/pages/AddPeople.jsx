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
      annualRevenue: "",
      totalFunding: "",
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
  
  const inputStyle = {
    margin: "20px",
    width: "300px",
    height: "60px",
    padding: "10px",
    fontSize: "20px",
  };

  const labelStyle = {
    width: "150px",
    display: "inline-block",
    fontSize: "20px",
  };

  const containerStyle = {
    margin: "10px 0",
    display: "flex",
    alignItems: "center",
  };

  
  const addClientToDatabase = async (client) => {
    try {
      console.log("Adding client:", client);
      const response = await fetch("http://localhost:3000/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      console.log("Response received:", response);
      if (!response.ok) {
        const errorData = await response.json();
        alert(`⚠️ ${errorData.error || "Error while adding the client."}`);
      }
    } catch (error) {
      console.error("Error:", error);
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
            results.data.forEach((client) => {
              // Ajout de chaque client dans la base de données
              addClientToDatabase(client);
            });
          },
        });
      } else if (fileExtension === "xlsx") {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        jsonData.forEach((client) => {
          // Ajout de chaque client dans la base de données
          addClientToDatabase(client);
        });
      } else {
        alert("Invalid file type! Please upload a CSV or XLSX file.");
      }
    };
    reader.readAsBinaryString(file);
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
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  
    try {
      const response = await fetch("http://localhost:3000/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),  
      });
      if (response.ok) {
        alert("✅ Client successfully added!");
        // Réinitialiser le formulaire
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
            annualRevenue: "",
            totalFunding: "",
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
      } else {
        const errorData = await response.json();  
        alert(`⚠️ ${errorData.error || "Error while adding the client."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ An error occurred.");
    }
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", backgroundColor: "#242424" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "50px" }}>
        <h1>Add a Client</h1>
        <h2>Upload Clients from File</h2>
        <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} /> 
        <form onSubmit={handleSubmit}>
          <h2>Personal Information</h2>
          {["firstName", "lastName", "title", "seniority", "departments", "mobilePhone", "email"].map((field) => (
            <div style={containerStyle} key={field}>
              <label style={labelStyle}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
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
          <div style={containerStyle}>
            <label style={labelStyle}>Email Status:</label>
            <select
              style={inputStyle}
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
          <h2>Company Information</h2>
          {["company", "email", "phone", "employees", "industry", "seoDescription"].map((field) => (
            <div style={containerStyle} key={field}>
              <label style={labelStyle}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                style={inputStyle}
                type={field === "employees" ? "number" : "text"}
                name={`company.${field}`}
                value={formData.company[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <h2>Geolocation</h2>
          {["address", "city", "state", "country"].map((field) => (
            <div style={containerStyle} key={field}>
              <label style={labelStyle}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
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
          <h2>Social Media</h2>
          {["linkedinUrl", "facebookUrl", "twitterUrl"].map((field) => (
            <div style={containerStyle} key={field}>
              <label style={labelStyle}>{field.replace("Url", " URL").toUpperCase()}:</label>
              <input
                style={inputStyle}
                type="text"
                name={`social.${field}`}
                value={formData.social[field]}
                onChange={handleChange}
              />
            </div>
          ))}
          <h2>Company Revenue Information</h2>
          {["companyName", "annualRevenue", "totalFunding", "latestFunding", "latestFundingAmount"].map((field) => (
            <div style={containerStyle} key={field}>
              <label style={labelStyle}>{field.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}:</label>
              <input
                style={inputStyle}
                type={field === "latestFunding" ? "date" : ["annualRevenue", "totalFunding", "latestFundingAmount"].includes(field) ? "number" : "text"}
                name={`companyRevenue.${field}`}
                value={formData.companyRevenue[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="submit">Add Client</button>
        </form>
      </div>
    </div>
  );
};

export default AddPeople;