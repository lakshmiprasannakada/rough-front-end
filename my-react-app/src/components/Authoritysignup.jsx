import './styles/Authoritysignup.css';
import React,{ useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './styles/Footer';
function  Authoritysignup() {
  const [Licensedata, setLicensedata] = useState(
    {name:"",Email_ID:"" ,password:"",mobile_no:"",designation:"", Qualification:"",OrderReferenceNo:""
      ,OrderDate:"",State:"",district:""});

const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file


    const [passerror, setPasserror] = useState("");
    const [phnerror,setPhnerror]=useState("");
    let invalid=false;
    let phnvalid=false;
    useEffect(  // district handle
      ()=>{
        fetchDistricts();
        return ()=>{
          // empty the district list
          setDistrictsList([]);
           }
      },[Licensedata.state]);

      const [validations, setValidations] = useState({
        lowercase: false,
        uppercase: false,
        digit: false,
        specialChar: false,
        length: false,
      });
    
      useEffect(() => {  // password handle
        // Define regular expressions for each validation rule
        const password = Licensedata.password;
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasValidLength = password.length >= 8 && password.length <= 30;
    
        // Update validation states based on regex tests
        setValidations({
          lowercase: hasLowercase,
          uppercase: hasUppercase,
          digit: hasDigit,
          specialChar: hasSpecialChar,
          length: hasValidLength,
        });
      }, [Licensedata.password]);
    const handleChange=(e)=>
    {
      e.preventDefault();
      const{name,value}=e.target;
      setLicensedata({...Licensedata,[name]:value});
      

      if(name==="password"&& value.length<8)
        {
         setPasserror("Password must contain 8 letters");
        }
        else if(name==="password"&&value.length>=8){
         setPasserror("");
        }

        if (name === "mobile_no" && value.length != 10) {
          setPhnerror("Phone number must contain exactly 10 digits");
      } else if (name === "mobile_no" && value.length === 10) {
          setPhnerror("");
      }

    }
// Handle file upload (for the PDF)
const handleFileChange = (e) => {
  setSelectedFile(e.target.files[0]); // Store the selected file in state
};

    const handleSubmit= async(e)=>
      {
        e.preventDefault();
        if(Licensedata.password.length<8)
          invalid=true;
  
        invalid ? setPasserror("Password must contain 8 letters") : setPasserror("");

        if( Licensedata.mobile_no.length!=10)
             phnvalid=true;

        phnvalid ? setPhnerror("Phone number  must contain 10 Numbers") : setPhnerror("");
      
        // Prepare form data
  const formData = new FormData();

  // Append all form fields
  formData.append("name", Licensedata.name);
  formData.append("Email_ID", Licensedata.Email_ID);
  formData.append("password", Licensedata.password);
  formData.append("mobile_no", Licensedata.mobile_no);
  formData.append("designation", Licensedata.designation);
  formData.append("Qualification", Licensedata.Qualification);
  formData.append("OrderReferenceNo", Licensedata.OrderReferenceNo);
  formData.append("OrderDate", Licensedata.OrderDate);
  formData.append("State", Licensedata.State);
  formData.append("district", Licensedata.district);

  // Append the PDF file (OrderPdfCopy)
  formData.append("OrderPdfCopy", selectedFile); // Append the selected file

  try {
    const response = await axios.post(
      "http://localhost:5002/api/licensingAuthority-reg",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      console.log("Successfully signed up!", response.data);
    } else {
      console.error("Signup failed", response.data);
    }
  } catch (error) {
    console.error("Error during signup:", error);
  }
};
  
  
    const indian_states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh (UT)", "Chhattisgarh", "Dadra and Nagar Haveli (UT)", "Daman and Diu (UT)", "Delhi (NCT)", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep (UT)", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry (UT)", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal"];
    const [districtsList, setDistrictsList] = useState([]);
    const fetchDistricts = async () => {
      try {
          const response = await fetch('http://localhost:5002/api/districts', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ stateName : Licensedata.state}),
          });

          if (!response.ok) {
              throw new Error('State not found or other error');
          }

          const data = await response.json();
          setDistrictsList(data.districts);
      } catch (error) {
          console.error('Error fetching districts:', error);
      }
  };

    return (
      <>
      <Header/>
      <form onSubmit={handleSubmit}>
      <div className="authority-sign-head1">
          <div className="authority-sign-head2">
          <p className=" authority-sign-para">Licensing Authority Registration Form</p>
          </div>
        </div>
        <div className="authority-sign-container">
           
      <label className=" authority-sign-label">Enter the name:</label> 
      <input type="text" name="name" onChange={handleChange} className=" authority-sign-input" /><br />
      
      <label className="  authority-sign-label">Enter the Email:</label> 
      <input type="email" name="email" onChange={handleChange} className=" authority-sign-input" /><br />

      <label className=" authority-sign-label">Enter the password:</label>  
      <input type="password" name="password" onChange={handleChange} className=" authority-sign-input" /><br />

      <ul className="password-checklist">
        <li className={validations.lowercase ? "valid" : "invalid"}>
          At least one lowercase letter
        </li>
        <li className={validations.uppercase ? "valid" : "invalid"}>
          At least one uppercase letter
        </li>
        <li className={validations.digit ? "valid" : "invalid"}>
          At least one digit
        </li>
        <li className={validations.specialChar ? "valid" : "invalid"}>
          At least one special character from the set
        </li>
        <li className={validations.length ? "valid" : "invalid"}>
          Be between 8 and 30 characters long
        </li>
      </ul>
      {passerror&&<p className="authority-sign-error">{passerror}</p>}

      <label className=" authority-sign-label">Enter the  mobile no:</label>
      <input type="number" name="mobile_no" onChange={handleChange} className=" authority-sign-input" /><br />
      {phnerror&&<p className="authority-sign-error">{phnerror}</p>}

      <label className=" authority-sign-label">Enter the Designation:</label> 
      <input type="text" name="designation" onChange={handleChange} className=" authority-sign-input" /><br />

      <label className=" authority-sign-label">Enter the Qualification: </label> 
      <input type="text" name="Qualification" onChange={handleChange} className=" authority-sign-input" /><br />

      <label className=" authority-sign-label">Enter the  OrderReferenceNo: </label> 
      <input type="text" name="OrderReferenceNo" onChange={handleChange} className=" authority-sign-input" /><br />

      <label className=" authority-sign-label">Enter the  OrderDate: </label> 
      <input type="date" name="OrderDate" onChange={handleChange} className=" authority-sign-input" /><br />


       
      <label className=" authority-sign-label">Enter the state:</label> 
      <select value={Licensedata.state} name="state" onChange={handleChange} className="authority-sign-input">
                <option value="" disabled>Select a state</option>
                {indian_states.map((state, index) => (
                    <option key={index} value={state}>
                        {state}
                    </option>
                ))}
            </select>
      <br />
      <label className="authority-sign-label">Enter district name:</label> 
      <select value={Licensedata.district} name="district" onChange={handleChange} className=" authority-sign-input">
                <option value="" disabled>Select a district</option>
                {districtsList.map((district, index) => (
                    <option key={index} value={district}>
                        {district}
                    </option>
                ))}
            </select>
     <br />
     
      {/* File upload input */}
  <label>Upload a PDF file:</label>
  <input
    type="file"
    accept=".pdf"
    onChange={handleFileChange}
    required />

    <button className=" authority-sign-button">submit</button>
    </div>
   
    </form>
    <Footer/>
    </>
    );
}

export default  Authoritysignup;

 