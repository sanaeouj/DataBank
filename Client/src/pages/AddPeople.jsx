import React, { useState } from "react";
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
  "Email Status": "EmailStatus",
  "Company": "company.company",
  "Company Email": "company.email",
  "Company Phone": "company.phone",
  "Company Employees": "company.employees",
  "Industry": "company.industry",
  "SEO Description": "company.seoDescription",
  "City": "geo.city",
  "Address": "geo.address",
  "State": "geo.state",
  "Country": "geo.country",
  "Annual Revenue": "companyRevenue.annualRevenue",
  "Total Funding": "companyRevenue.totalFunding",
  "Latest Funding": "companyRevenue.latestFunding",
  "Latest Funding Amount": "companyRevenue.latestFundingAmount",
  "LinkedIn": "social.linkedinUrl",
  "Facebook": "social.facebookUrl",
  "Twitter": "social.twitterUrl",
};

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
      annualRevenue: "",
      totalFunding: "",
      latestFunding: "",
      latestFundingAmount: "",
    },
  });
  const [fileData, setFileData] = useState([]);

  const addClientToDatabase = async (client) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
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
        let newClient = { ...formData };
        Object.entries(client).forEach(([csvKey, value]) => {
          const formKey = importMapping[csvKey] || csvKey;
          const keys = formKey.split(".");
          if (keys.length === 1) {
            newClient[keys[0]] = value;
          } else if (keys.length === 2) {
            newClient[keys[0]][keys[1]] = value;
          }
        });
        if (!newClient.firstName || !newClient.lastName || !newClient.email) {
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
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
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
            annualRevenue: "",
            totalFunding: "",
            latestFunding: "",
            latestFundingAmount: "",
          },
        });
      } else {
        const errorData = await response.json();
        alert(`⚠️ ${errorData.error || "Error adding the client."}`);
      }
    } catch (error) {
      alert("❌ An error occurred.");
    }
  };

  return (
    <div style={{ display: "flex", width: "90vw", height: "100vh", backgroundColor: "#242424" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "50px", color: "#333" }}>
        <h1 style={{ color: "#fff", marginBottom: "20px" }}>Add Client</h1>
        <div style={{ backgroundColor: "#2c2c2c", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ color: "#fff" }}>Import Clients from File</h3>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            style={{ fontSize: "16px", margin: "10px" }}
          />
          <button type="button" onClick={handleAddFile}>
            Process File Data
          </button>
          <form onSubmit={handleSubmit}>
            {/* Form fields go here */}
            <button type="submit">Add Client</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPeople;