import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Container,
  Dropdown,
  Nav,
} from "react-bootstrap";
import NavBarD from "./NavbarD";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "http://192.168.90.100:5000/api"; // Replace with your actual backend URL

const DiagnosisTabs = () => {
  const [key, setKey] = useState("piles");

  const tabData = [
    {
      id: "piles",
      title: "Piles",
      checkboxes: ["GRADE 1", "GRADE 2", "GRADE 3", "GRADE 4"],
    },
    {
      id: "fistula",
      title: "Fistula",
      checkboxes: [
        "GLUTEAL",
        "HIGH",
        "HORSESHOE",
        "NIDAL",
        "SCROTAL",
        "SUPRALEVATOR",
        "TRANSPHINCTERIC",
        "INTERSPHINCTERIC",
        "VAGINAL",
        "VULVAL",
        "COMPLEX",
        "RECURRENT",
      ],
    },
    {
      id: "hernia",
      title: "Hernia",
      checkboxes: [
        "VENTRAL",
        "INCISIONAL",
        "EPIGASTRIC",
        "RIGHT INGUINAL",
        "LEFT INGUINAL",
        "BILATERAL INGUINAL",
        "SUPRA UMBILICAL",
        "PARA UMBILICAL",
        "MULTIPLE DEFECTS UMBILICAL",
        "INFRA UMBILICAL",
      ],
    },
    {
      id: "varicoseVeins",
      title: "Varicose Veins",
      checkboxes: ["RIGHT", "LEFT", "BILATERAL"],
    },
    {
      id: "prolapse",
      title: "Prolapse",
      checkboxes: ["MUCOSAL", "INCOMPLETE", "PROCIDENTIA"],
    },
    {
      id: "circumcision",
      title: "Circumcision",
      checkboxes: [],
      textarea: "circumcision_duration",
    },
    {
      id: "abscess",
      title: "Abscess",
      checkboxes: [],
      textarea: "abscess_duration",
    },
    {
      id: "fissure",
      title: "Fissure",
      checkboxes: [],
      textarea: "fissure_duration",
    },
    {
      id: "ibs",
      title: "IBS",
      checkboxes: [],
      textarea: "ibs_duration",
    },
    {
      id: "urology",
      title: "Urology",
      checkboxes: [],
      textarea: "urology_duration",
    },
  ];

  return (
    <div className="box">
      <div className="box-header">
        <Nav variant="tabs" className="nav-tabs-left">
          {tabData.map((tab) => (
            <Nav.Item key={tab.id}>
              <Nav.Link
                eventKey={tab.id}
                active={key === tab.id}
                onClick={() => setKey(tab.id)}
                style={{
                  padding: "10px 15px",
                  margin: "0 2px",
                  borderRadius: "4px 4px 0 0",
                  backgroundColor: key === tab.id ? "#fff" : "#f8f9fa",
                  borderBottom: key === tab.id ? "2px solid #007bff" : "none",
                }}
              >
                <i className="icon-plus"></i>
                {tab.title}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      <div className="box-content padded">
        <div className="tab-content">
          {tabData.map((tab) => (
            <div
              key={tab.id}
              className={`tab-pane ${key === tab.id ? "active" : ""}`}
              style={{ padding: "15px" }}
            >
              <div className="box-content">
                <Row>
                  <Col>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "15px",
                        marginBottom: "20px",
                      }}
                    >
                      {tab.checkboxes.map((checkbox, index) => (
                        <Form.Check
                          key={index}
                          type="checkbox"
                          label={checkbox}
                          style={{
                            flex: "0 0 auto",
                            minWidth: "200px",
                            margin: "5px 15px",
                            fontWeight: "400",
                          }}
                        />
                      ))}
                    </div>
                  </Col>
                </Row>
                {tab.textarea && (
                  <Row>
                    <Col>
                      <Form.Control
                        as="textarea"
                        placeholder="Duration"
                        style={{
                          width: "100%",
                          marginTop: "10px",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                        }}
                      />
                    </Col>
                  </Row>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Diagnosis() {
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [selectedOption, setSelectedOption] = useState({
    RF: [],
    Laser: [],
    MW: [],
  }); // Track selected checkboxes
  const [selectedAdviceOptions, setSelectedAdviceOptions] = useState({
    advice: [],
  }); // Track selected checkboxes

  const [formData, setFormData] = useState({
    advice: "",
    diagnosis: "",
    date_diagnosis: "",
    provisionaldiagnosis: "",
    investigationorders: "",
    diagnosisAdvice: {
      medication: false,
      surgery: false,
      test: false,
    },
    // medicinesPrescribed: false,
    medicines: {
      aac: false,
      antacid: false,
      probiotics: false,
      nsaids: false,
      antibiotics: false,
      other: "", // Add an "other" field for the textarea
    },
    medicineDetails: "",
    surgicalAdvice: [],
    comment: "",
    adviceComment: "",
    SurgicalDate: "",
    RF: "",
    Laser: "",
    MW: "",
    categoryComment: "",
    medical_mx: {
      mcdpa: false,
      manometry: false,
      diet: false,
      echo: false,
      uroflowmetry: false,
      colo: false,
      xray: false,
      mri: false,
      cht: false,
      gastro: false,
      ct: false,
      doppler: false,
      biofeedback: false,
      labInvestigation: false,
      ultrasonography: false,
      EchoAnalImaging: false,
    },
    other: {
      insurance: false,
      reimbursement: false,
      workshop: false,
      pdc: false,
    },
    consultantDoctor: "",
    assistanceDoctor: "",
  });

  const surgicalAdviceOptions = [
    "ALISKLAMP",
    "EUA",
    "EVLA",
    "FILAC",
    "I & D",
    "HERNIA",
    "LHP",
    "LPP",
    "MIPH",
    "STARR",
    "OTHER",
  ];

  const [errors, setErrors] = useState({});
  const [diagnosis, setDiagnosis] = useState([]);
  const [consultantsDoctor, setConsultantsDoctor] = useState([]);
  const [assistantsDoctor, setAssistantsDoctor] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    consultantsDoctorName: "",
    assistantsDoctorName: "",
  });
  const [showEditButton, setShowEditButton] = useState(false); // Controls visibility of "Edit Diagnosis"
  const [isDisabled, setIsDisabled] = useState(false); // Controls edit mode
  const [disablePreviousButton, setDisablePreviousButton] = useState(false); // Disables "Previous Records" after clicking
  const [showSurgicalDate, setShowSurgicalDate] = useState(false);
  const [previousRecord, setPreviousRecord] = useState({
    consultantDoctor: "",
    assistanceDoctor: "",
  });
  // Add state for previous records
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedPatientId");
    console.log("Retrieved from localStorage:", storedPatientId);
    if (storedPatientId) setPatientId(storedPatientId);
  }, []);

  useEffect(() => {
    if (!patientId) {
      console.warn("No patientId found, skipping fetch");
      return;
    }
    const fetchPatientData = async () => {
      console.log(`Fetching data for patient ID: ${patientId}`);
      try {
        const response = await fetch(
          `${BASE_URL}/V1/diagnosis/listDiagnosis/${patientId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          console.error(
            "API Response Error:",
            response.status,
            await response.text()
          );
          return;
        }

        const data = await response.json();
        console.log("Fetched Data:", data.data.diagnosisData);

        // ❌ Don't update the form data automatically
        if (!data?.data?.diagnosisData?.length) {
          console.warn("No previous data found. Keeping the form empty.");
          setFormData((prevData) => ({
            ...prevData,
            advice: "",
            diagnosis: "",
            date_diagnosis: "",
            provisionaldiagnosis: "",
            investigationorders: "",
            diagnosisAdvice: {
              medication: false,
              surgery: false,
              test: false,
            },
            // medicinesPrescribed: false,
            medicines: {
              aac: false,
              antacid: false,
              probiotics: false,
              nsaids: false,
              antibiotics: false,
              other: "", // Add an "other" field for the textarea
            },
            medicineDetails: "",
            surgicalAdvice: [],
            comment: "",
            adviceComment: "",
            SurgicalDate: "",
            RF: "",
            Laser: "",
            MW: "",
            categoryComment: "",
            medical_mx: {
              mcdpa: false,
              manometry: false,
              diet: false,
              echo: false,
              uroflowmetry: false,
              colo: false,
              xray: false,
              mri: false,
              cht: false,
              gastro: false,
              ct: false,
              doppler: false,
              biofeedback: false,
              labInvestigation: false,
              ultrasonography: false,
              EchoAnalImaging: false,
            },
            other: {
              insurance: false,
              reimbursement: false,
              workshop: false,
              pdc: false,
            },
            consultantDoctor: "",
            assistanceDoctor: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Fetch options from API
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/V1/patienttabsdp/consultant_dropdown",
            setter: setConsultantsDoctor,
          },
          {
            url: "/V1/patienttabsdp/assistantDoc_dropdown",
            setter: setAssistantsDoctor,
          },
        ];

        for (const { url, setter } of endpoints) {
          const response = await fetch(`${BASE_URL}${url}`);
          const data = await response.json();
          if (response.ok) setter(data.data || []);
        }
      } catch (err) {
        setErrors("Failed to fetch dropdown data.");
      }
    };
    fetchDropdownOptions();
  }, []);

  const categoryOptions = {
    RF: ["A", "A+", "A-", "B", "B+", "C", "C+", "C-", "C++", "D", "D+", "E"],
    Laser: ["A", "A+", "A-", "B", "B+", "C", "C+", "C-", "C++", "D", "D+", "E"],
    MW: ["A", "A+", "A-", "B", "B+", "C", "C+", "C-", "C++", "D", "D+", "E"],
  };

  const handleCategoryChange = (category, e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      // Ensure the category is an array
      const currentCategory = Array.isArray(prevData[category])
        ? prevData[category]
        : [];
      const updatedCategory = checked
        ? [...currentCategory, value]
        : currentCategory.filter((item) => item !== value);

      return {
        ...prevData,
        [category]: updatedCategory,
      };
    });
  };

  const handleAdviceChange = (selectedAdvice) => {
    setSelectedAdviceOptions((prevState) => {
      const updatedAdvice = prevState.advice.includes(selectedAdvice)
        ? prevState.advice.filter((item) => item !== selectedAdvice)
        : [...prevState.advice, selectedAdvice];

      return { ...prevState, advice: updatedAdvice };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "medicinesPrescribed") {
      // If the input is for "Other" medicines, update the "other" key in the medicinesPrescribed object
      setFormData((prevData) => ({
        ...prevData,
        medicines: {
          ...prevData.medicines,
          other: value, // Update the "other" field in the medicinesPrescribed object
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    // Check if the surgical date checkbox is clicked
    if (name === "checkSurgicalDate") {
      setShowSurgicalDate(checked);
    }
    const [parent, child] = name.split(".");

    // if (parent === "medicinesPrescribed") {
    //   // Handle medicinesPrescribed checkboxes
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     medicinesPrescribed: {
    //       ...prevData.medicinesPrescribed,
    //       [child]: checked, // Update the specific medicine checkbox
    //     },
    //   }));
    // } else
    if (child) {
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: checked },
      });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };

  const validate = () => {
    const errors = {};
    // Add validation logic here
    return errors;
  };

  // Update the date formatting utility functions
  const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === "0000-00-00" || dateString === "")
      return "";

    try {
      // Handle different date formats
      let date;
      if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/");
        date = new Date(year, month - 1, day);
      } else if (dateString.includes("-")) {
        date = new Date(dateString);
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) return ""; // Return empty string if invalid date

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      console.warn("Invalid date format:", dateString);
      return "";
    }
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString || dateString === "0000-00-00" || dateString === "")
      return null;

    try {
      // If the date is already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // If the date is in DD/MM/YYYY format
      if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      // If it's a Date object or timestamp
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }

      return null;
    } catch (error) {
      console.warn("Invalid date format:", dateString);
      return null;
    }
  };

  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();

    try {
      // Basic validation
      // if (!formData.diagnosis || formData.diagnosis.trim() === "") {
      //   alert("Please enter a diagnosis");
      //   return;
      // }

      if (!patientId) {
        alert("Patient ID is required");
        return;
      }
      const adviceArray = [];
      if (formData.diagnosisAdvice && formData.diagnosisAdvice.medication) {
        adviceArray.push("Medication");
      }
      if (formData.diagnosisAdvice && formData.diagnosisAdvice.surgery) {
        adviceArray.push("Surgery");
      }
      if (formData.diagnosisAdvice && formData.diagnosisAdvice.test) {
        adviceArray.push("Test");
      }

      const medicineArray = [];
      if (formData.medicines?.aac) medicineArray.push("AAC");
      if (formData.medicines?.probiotics) medicineArray.push("PROBIOTICS");
      if (formData.medicines?.nsaids) medicineArray.push("NSAIDS");
      if (formData.medicines?.antibiotics) medicineArray.push("ANTIBIOTICS");
      if (formData.medicines?.antacid) medicineArray.push("ANTACID");
      if (formData.medicines?.other)
        medicineArray.push(formData.medicines.other);

      const otherArray = [];
      if (formData.other.insurance) otherArray.push("Insurance");
      if (formData.other.reimbursement) otherArray.push("Reimbursement");
      if (formData.other.workshop) otherArray.push("Workshop");
      if (formData.other.pdc) otherArray.push("PDC");

      const medical_mxArray = [];
      if (formData.medical_mx.mcdpa) medical_mx.push("MCDPA");
      if (formData.medical_mx.manometry) medical_mxArray.push("Manometry");
      if (formData.medical_mx.diet) medical_mxArray.push("Diet");
      if (formData.medical_mx.echo) medical_mxArray.push("ECHO");
      if (formData.medical_mx.uroflowmetry)
        medical_mxArray.push("Uroflowmetry");
      if (formData.medical_mx.colo) medical_mxArray.push("Colo");
      if (formData.medical_mx.xray) medical_mxArray.push("X-ray");
      if (formData.medical_mx.mri) medical_mxArray.push("MRI");
      if (formData.medical_mx.cht) medical_mxArray.push("CHT");
      if (formData.medical_mx.gastro) medical_mxArray.push("Gastro");
      if (formData.medical_mx.ct) medical_mxArray.push("CT");
      if (formData.medical_mx.doppler) medical_mxArray.push("Doppler");
      if (formData.medical_mx.biofeedback) medical_mxArray.push("Biofeedback");
      if (formData.medical_mx.labInvestigation)
        medical_mxArray.push("Lab  Investigation");
      if (formData.medical_mx.ultrasonography)
        medical_mxArray.push("Ultrasonography");
      if (formData.medical_mx.EchoAnalImaging)
        medical_mxArray.push("3D Endo Anal Imaging");

      const requestBody = {
        patientId: patientId.toString(),
        diagnosis: formData.diagnosis,
        advice: selectedAdviceOptions.advice.join(","),
        date_diagnosis: formData.date_diagnosis || null,
        provisionaldiagnosis: formData.provisionaldiagnosis || "",
        investigationorders: formData.investigationorders,
        diagnosisAdvice: adviceArray.join(","),
        medicines: medicineArray.join(","),
        medicineDetails: formData.medicineDetails || "",
        surgicalAdvice: formData.surgicalAdvice || "", // Convert array to string
        comment: formData.comment || "",
        adviceComment: formData.adviceComment || "",
        SurgicalDate: formData.SurgicalDate || null,
        RF: selectedOption.RF.join(","), // Convert array to string
        Laser: selectedOption.Laser.join(","), // Convert array to string
        MW: selectedOption.MW.join(","), // Convert array to string
        categoryComment: formData.categoryComment || "",
        other: otherArray.join(","),
        consultantDoctor: formData.consultantDoctor || "",
        assistanceDoctor: formData.assistanceDoctor || "",
        medical_mx: medical_mxArray.join(","),
      };
      // Determine URL and method based on the button clicked
      const url = isEdit
        ? `${BASE_URL}/V1/diagnosis/updateDiagnosis/${patientId}`
        : `${BASE_URL}/V1/diagnosis/addDiagnosis/${patientId}`;
      const method = isEdit ? "PUT" : "POST";

      console.log(`Making ${method} request to ${url}`);

      console.log("Request body:", requestBody);
      console.log("Submitting to:", url);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
            responseData.error ||
            "Failed to save diagnosis"
        );
      }

      alert(
        isEdit
          ? "Diagnosis updated successfully!"
          : "Diagnosis submitted successfully!"
      );

      if (isEdit) {
        setIsDisabled(true);
      }
      setSelectedOption({
        RF: [],
        Laser: [],
        MW: [],
      });
      setSelectedAdviceOptions({
        advice: [],
      });
    } catch (error) {
      console.error("Submission Error:", error);
      alert(
        `Error: ${
          error.message || "An error occurred while submitting the diagnosis"
        }`
      );
    }
  };
  const [previousRecordDate, setPreviousRecordDate] = useState(""); // Store the previous record date
  const fetchPreviousRecords = async () => {
    try {
      if (!patientId) {
        console.error("No patient ID available");
        return;
      }

      console.log("Fetching records for patient:", patientId);

      const response = await fetch(
        `${BASE_URL}/V1/diagnosis/listDiagnosis/${patientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("Fetched data:", result);

      if (!response.ok) {
        throw new Error("Failed to fetch previous records");
      }

      const enrichedDiagnosisData = result.data.enrichedDiagnosisData;
      const diagnosisData = result.data.diagnosisData[0];
      setPreviousRecord({
        consultantDoctor: diagnosisData.consultantDoctor || "",
        assistanceDoctor: diagnosisData.assistanceDoctor || "",
      });

      const AdviceString = diagnosisData.diagnosisAdvice || "";
      const AdviceArray = AdviceString.split(",").map((item) => item.trim());

      const otherString = diagnosisData.other || "";
      const otherArray = otherString.split(",").map((item) => item.trim());

      const medical_mxString = diagnosisData.medical_mx || "";
      const medical_mxArray = medical_mxString
        .split(",")
        .map((item) => item.trim());

      const medicineString = diagnosisData.medicines || "";
      const MknownConditions = [
        "AAC",
        "PROBIOTICS",
        "NSAIDS",
        "ANTIBIOTICS",
        "ANTACID",
      ];
      const medicineArray = medicineString
        .split(",")
        .map((item) => item.trim());

      // Update formData with all the fields from the API
      setFormData((prevData) => ({
        ...prevData,
        ...diagnosisData,
        ...enrichedDiagnosisData,
        date_diagnosis: diagnosisData.date_diagnosis || "",
        diagnosis: diagnosisData.diagnosis || "",
        provisionaldiagnosis: diagnosisData.provisionaldiagnosis || "",
        investigationorders: diagnosisData.investigationorders || "",
        comment: diagnosisData.comment || "",
        categoryComment: diagnosisData.categoryComment || "",
        adviceComment: diagnosisData.adviceComment || "",
        diagnosisAdvice: {
          medication: AdviceArray.includes("Medication"),
          surgery: AdviceArray.includes("Surgery"),
          test: AdviceArray.includes("Test"),
        },
        medicines: {
          ...prevData.medicines,
          aac: medicineArray.includes("AAC"),
          probiotics: medicineArray.includes("PROBIOTICS"),
          nsaids: medicineArray.includes("NSAIDS"),
          antibiotics: medicineArray.includes("ANTIBIOTICS"),
          antacid: medicineArray.includes("ANTACID"),
          other: medicineArray
            .filter((condition) => !MknownConditions.includes(condition))
            .join(", "),
        },
        other: {
          insurance: otherArray.includes("Insurance"),
          reimbursement: otherArray.includes("Reimbursement"),
          workshop: otherArray.includes("Workshop"),
          pdc: otherArray.includes("PDC"),
        },
        medical_mx: {
          mcdpa: medical_mxArray.includes("MCDPA"),
          manometry: medical_mxArray.includes("Manometry"),
          diet: medical_mxArray.includes("Diet"),
          echo: medical_mxArray.includes("ECHO"),
          uroflowmetry: medical_mxArray.includes("Uroflowmetry"),
          colo: medical_mxArray.includes("Colo"),
          xray: medical_mxArray.includes("X-ray"),
          mri: medical_mxArray.includes("MRI"),
          cht: medical_mxArray.includes("CHT"),
          gastro: medical_mxArray.includes("Gastro"),
          ct: medical_mxArray.includes("CT"),
          doppler: medical_mxArray.includes("Doppler"),
          biofeedback: medical_mxArray.includes("Biofeedback"),
          labInvestigation: medical_mxArray.includes("Lab  Investigation"),
          ultrasonography: medical_mxArray.includes("Ultrasonography"),
          EchoAnalImaging: medical_mxArray.includes("3D Endo Anal Imaging"),
        },
      }));
      setSelectedOption({
        RF: diagnosisData.RF ? diagnosisData.RF.split(",") : [],
        Laser: diagnosisData.Laser ? diagnosisData.Laser.split(",") : [],
        MW: diagnosisData.MW ? diagnosisData.MW.split(",") : [],
      });
      setSelectedAdviceOptions({
        advice: diagnosisData.advice ? diagnosisData.advice.split(",") : [],
      });
      // Show the "Edit Diagnosis" button
      setShowEditButton(true);
      // Disable "Previous Records" button after clicking it
      setDisablePreviousButton(true);
      // Disable form fields
      setIsDisabled(true);

      console.log("Form data updated with previous records");
    } catch (error) {
      console.error("Error fetching previous records:", error);
      alert("Failed to fetch previous records.");
    }
  };

  // Add function to handle record selection
  const handleRecordSelect = (record) => {
    setFormData((prevData) => ({
      ...prevData,
      ...record,
    }));
    setSelectedRecord(record);
    setIsDisabled(true);
  };

  // Enable form editing when "Edit Diagnosis" is clicked
  const handleEditDiagnosis = () => {
    setIsDisabled(false); // Enable form editing
    setShowEditButton(false); // Hide the "Edit Diagnosis" button while in edit mode
    // This will enable "Save Edit Diagnosis" and disable "Save New Record"
  };

  const handleStateChange = (e, value, category) => {
    if (isDisabled) return; // Don't update if form is disabled

    const { checked } = e.target;
    setSelectedOption((prevState) => ({
      ...prevState,
      [category]: checked
        ? [...prevState[category], value]
        : prevState[category].filter((item) => item !== value),
    }));
  };

  const handleNewRecord = () => {
    setFormData({
      date_diagnosis: new Date().toISOString().split("T")[0],
      advice: "",
      provisionaldiagnosis: "",
      investigationorders: "",
      diagnosis: "",
      comment: "",
      diagnosisAdvice: {
        medication: "",
        surgery: "",
        test: "",
      },
      adviceComment: "",
      SurgicalDate: "",
      RF: "",
      Laser: "",
      MW: "",
      categoryComment: "",
      consultantDoctor: "",
      assistanceDoctor: "",
      medicines: {
        aac: "",
        probiotics: "",
        nsaids: "",
        antibiotics: "",
        antacid: "",
      },
      other: {
        insurance: "",
        reimbursement: "",
        workshop: "",
        pdc: "",
      },
      medical_mx: {
        mcdpa: "",
        manometry: "",
        diet: "",
        echo: "",
        uroflowmetry: "",
        colo: "",
        xray: "",
        mri: "",
        cht: "",
        gastro: "",
        ct: "",
        doppler: "",
        biofeedback: "",
        labInvestigation: "",
        ultrasonography: "",
        EchoAnalImaging: "",
      },
    });
    setSelectedOption({
      RF: [],
      Laser: [],
      MW: [],
    });
    setSelectedAdviceOptions({
      advice: [],
    });

    // Hide "Edit Diagnosis" button when creating a new record
    setShowEditButton(false);
    // Enable the "Previous Records" button when creating a new record
    setDisablePreviousButton(false);
    setIsDisabled(false); // Allow editing for a new record
    alert("New Record: You can now enter new data.");
  };

  const handlePrint = () => {
    window.print();
  };

  // Add a useEffect to log form data changes

  return (
    <div
      className="themebody-wrap"
      style={{
        background: "linear-gradient(to right, #e0f7fa, #80deea)",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Poppins', Arial, sans-serif",
      }}
    >
      <NavBarD pagename="Diagnosis" />
      <Container fluid>
        <Row>
          <Col>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                borderColor: "#00bcd4",
                background: "#f8f9fa",
                border: "3px solid #00bcd4",
              }}
            >
              <Card.Body>
                <Form onSubmit={(e) => handleSubmit(e, isDisabled)}>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginRight: "20px" }}
                      onClick={handleNewRecord}
                    >
                      New Record
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ float: "right" }}
                      onClick={handlePrint}
                    >
                      Print
                    </button>

                    <br />
                    <br />
                    <div>
                      {/* Previous Records Button */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ float: "right", marginRight: "7px" }}
                        onClick={fetchPreviousRecords}
                        disabled={disablePreviousButton}
                      >
                        Previous Records
                      </button>

                      {/* Show Edit Diagnosis Button only after clicking "Previous Records" */}
                      {showEditButton && (
                        <button
                          type="button"
                          className="btn btn-warning"
                          style={{ float: "right", marginRight: "7px" }}
                          onClick={handleEditDiagnosis}
                        >
                          Edit Diagnosis
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Show the previous record date when available */}
                  {previousRecordDate && (
                    <div style={{ marginTop: "15px" }}>
                      <strong>Previous Record Date: </strong>
                      <span>{previousRecordDate}</span>
                    </div>
                  )}
                  <br />
                  <Row className="mb-3">
                    <Col md={3} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Diagnosis Date:</Form.Label>
                        <DatePicker
                          selected={
                            formData?.date_diagnosis
                              ? new Date(formData.date_diagnosis)
                              : null
                          }
                          onChange={(date) => {
                            setFormData((prev) => ({
                              ...prev,
                              date_diagnosis: date
                                ? date.toISOString().split("T")[0]
                                : "",
                            }));
                          }}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Select Appointment Date"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          style={{
                            height: "38px",
                            width: "100%",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Provisional Diagnosis:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="provisionaldiagnosis"
                          value={formData.provisionaldiagnosis}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              provisionaldiagnosis: e.target.value,
                            })
                          }
                          disabled={isDisabled} // Disable until Edit is clicked
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row className="mb-3">
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>Investigation Orders:</Form.Label>
                        <Form.Control
                          as="textarea" // Fixed the name
                          name="investigationorders"
                          value={formData.investigationorders}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              investigationorders: e.target.value,
                            })
                          }
                          disabled={isDisabled} // Disable until Edit is clicked
                        />
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label>
                          Diagnosis: <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          name="diagnosis"
                          value={formData.diagnosis || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              diagnosis: e.target.value,
                            })
                          }
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row className="mb-3">
                    <Col md={8}>
                      <Form.Label>Advice Type:</Form.Label>
                      <div className="d-flex flex-wrap">
                        <label className="d-flex align-items-center me-3">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="diagnosisAdvice.medication"
                            checked={formData.diagnosisAdvice?.medication}
                            onChange={handleCheckboxChange}
                            disabled={isDisabled}
                            id="diagnosisAdvice_medication"
                            style={{ marginRight: "5px" }}
                          />
                          Medication
                        </label>

                        <label className="d-flex align-items-center me-3">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="diagnosisAdvice.surgery"
                            checked={formData.diagnosisAdvice?.surgery}
                            onChange={handleCheckboxChange}
                            disabled={isDisabled}
                            id="diagnosisAdvice_surgery"
                            style={{ marginRight: "5px" }}
                          />
                          Surgery
                        </label>

                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="diagnosisAdvice.test"
                            checked={formData.diagnosisAdvice?.test}
                            onChange={handleCheckboxChange}
                            disabled={isDisabled}
                            id="diagnosisAdvice_test"
                            style={{ marginRight: "5px" }}
                          />
                          Test
                        </label>
                      </div>

                      {/* Show textarea only when "Test" is checked */}
                      {formData.diagnosisAdvice?.test && (
                        <Form.Control
                          as="textarea"
                          placeholder="Enter test details"
                          className="mt-2"
                        />
                      )}
                    </Col>
                  </Row>
                  <br />
                  <DiagnosisTabs />
                  <br />

                  <Row className="mb-3">
                    <Col md={10}>
                      <Form.Label>Medicines Prescribed:</Form.Label>
                      <div className="d-flex flex-wrap">
                        {[
                          { label: "AAC", name: "medicines.aac" },
                          { label: "ANTACID", name: "medicines.antacid" },
                          { label: "PROBIOTICS", name: "medicines.probiotics" },
                          { label: "NSAIDS", name: "medicines.nsaids" },
                          {
                            label: "ANTIBIOTICS",
                            name: "medicines.antibiotics",
                          },
                        ].map(({ label, name }) => (
                          <label
                            key={name}
                            className="d-flex align-items-center me-3"
                          >
                            <Form.Check
                              inline
                              type="checkbox"
                              name={name}
                              checked={
                                formData.medicines?.[name.split(".")[1]] ||
                                false
                              }
                              onChange={handleCheckboxChange}
                              id={name}
                              style={{ marginRight: "5px" }}
                            />
                            {label}
                          </label>
                        ))}
                      </div>

                      {/* Textarea for Other Medicines */}
                      <Form.Control
                        as="textarea"
                        placeholder="Other"
                        name="medicines.other"
                        value={formData.medicines?.other || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            medicines: {
                              ...prev.medicines,
                              other: e.target.value,
                            },
                          }))
                        }
                        // disabled={isDisabled}
                        className="mt-2"
                      />
                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Surgical Advice:</Form.Label>
                        <Dropdown>
                          <Dropdown.Toggle variant="primary" as={Button}>
                            {selectedAdviceOptions.advice.length > 0
                              ? selectedAdviceOptions.advice.join(", ")
                              : "Select Surgical Advice"}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {surgicalAdviceOptions.map((advice, index) => (
                              <Dropdown.Item key={index} as="div">
                                <Form.Check
                                  type="checkbox"
                                  label={advice}
                                  value={advice}
                                  checked={selectedAdviceOptions.advice.includes(
                                    advice
                                  )}
                                  onChange={() => handleAdviceChange(advice)}
                                />
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Comment:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="comment"
                          value={formData.comment}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              comment: e.target.value,
                            })
                          }
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Advice Comment:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="adviceComment"
                          value={formData.adviceComment || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              adviceComment: e.target.value,
                            })
                          }
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md={2} className="mb-4">
                      <Form.Group className="mb-3">
                        {/* <Form.Label>Check Surgical Date:</Form.Label> */}
                        <Form.Check
                          type="checkbox"
                          label="Surgical Date"
                          name="checkSurgicalDate"
                          checked={showSurgicalDate}
                          onChange={handleCheckboxChange}
                        />
                      </Form.Group>
                    </Col>
                    {/* Only show DatePicker when checkbox is checked */}
                    {showSurgicalDate && (
                      <Col md={4} className="mb-4">
                        <Form.Group className="mb-3">
                          {/* <Form.Label>Surgical Date:</Form.Label> */}
                          <DatePicker
                            selected={
                              formData?.SurgicalDate
                                ? new Date(formData.SurgicalDate)
                                : null
                            }
                            onChange={(date) => {
                              handleInputChange({
                                target: {
                                  name: "SurgicalDate",
                                  value: date
                                    ? date.toISOString().split("T")[0]
                                    : "",
                                },
                              });
                            }}
                            dateFormat="yyyy-MM-dd"
                            className="form-control"
                            placeholderText="Select Surgical Date"
                            maxDate={new Date()}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                          />
                        </Form.Group>
                      </Col>
                    )}
                  </Row>
                  <br />
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Category:</Form.Label>
                        <Row className="mb-3">
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>RF:</Form.Label>
                              <Dropdown>
                                <Dropdown.Toggle variant="primary" as={Button}>
                                  {selectedOption.RF.length > 0
                                    ? selectedOption.RF.join(", ")
                                    : "Select RF"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  {categoryOptions.RF.map((option) => (
                                    <Dropdown.Item key={option} as="div">
                                      <Form.Check
                                        type="checkbox"
                                        label={option}
                                        value={option}
                                        checked={selectedOption.RF.includes(
                                          option
                                        )}
                                        onChange={(e) =>
                                          handleStateChange(e, option, "RF")
                                        }
                                      />
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            </Form.Group>
                          </Col>

                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>Laser:</Form.Label>
                              <Dropdown>
                                <Dropdown.Toggle variant="primary" as={Button}>
                                  {selectedOption.Laser.length > 0
                                    ? selectedOption.Laser.join(", ")
                                    : "Select Laser"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  {categoryOptions.Laser.map((option) => (
                                    <Dropdown.Item key={option} as="div">
                                      <Form.Check
                                        type="checkbox"
                                        label={option}
                                        value={option}
                                        checked={selectedOption.Laser.includes(
                                          option
                                        )}
                                        onChange={(e) =>
                                          handleStateChange(e, option, "Laser")
                                        }
                                      />
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            </Form.Group>
                          </Col>

                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>MW:</Form.Label>
                              <Dropdown>
                                <Dropdown.Toggle variant="primary" as={Button}>
                                  {selectedOption.MW.length > 0
                                    ? selectedOption.MW.join(", ")
                                    : "Select MW"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  {categoryOptions.MW.map((option) => (
                                    <Dropdown.Item key={option} as="div">
                                      <Form.Check
                                        type="checkbox"
                                        label={option}
                                        value={option}
                                        checked={selectedOption.MW.includes(
                                          option
                                        )}
                                        onChange={(e) =>
                                          handleStateChange(e, option, "MW")
                                        }
                                      />
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Category Comment:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="categoryComment"
                          value={formData.categoryComment}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              categoryComment: e.target.value,
                            })
                          }
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Advice:</Form.Label>
                        <Row>
                          {[
                            { label: "MCDPA", name: "medical_mx.mcdpa" },
                            {
                              label: "MANOMETRY",
                              name: "medical_mx.manometry",
                            },
                            { label: "DIET", name: "medical_mx.diet" },
                            { label: "ECHO", name: "medical_mx.echo" },
                            {
                              label: "UROFLOWMETRY",
                              name: "medical_mx.uroflowmetry",
                            },
                            { label: "COLO", name: "medical_mx.colo" },
                            { label: "X-RAY", name: "medical_mx.xray" },
                            { label: "MRI", name: "medical_mx.mri" },
                            { label: "CHT", name: "medical_mx.cht" },
                            { label: "GASTRO", name: "medical_mx.gastro" },
                            { label: "CT", name: "medical_mx.ct" },
                            { label: "DOPPLER", name: "medical_mx.doppler" },
                            {
                              label: "BIOFEEDBACK",
                              name: "medical_mx.biofeedback",
                            },
                            {
                              label: "LAB INVESTIGATION",
                              name: "medical_mx.labInvestigation",
                            },
                            {
                              label: "ULTRASONOGRAPHY",
                              name: "medical_mx.ultrasonography",
                            },
                            {
                              label: "3D ENDO ANAL IMAGING",
                              name: "medical_mx.EchoAnalImaging",
                            },
                          ].map(({ label, name }, index) => (
                            <Col md={4} key={index}>
                              <label className="d-flex align-items-center">
                                <Form.Check
                                  type="checkbox"
                                  name={name}
                                  checked={
                                    formData.medical_mx?.[name.split(".")[1]] ||
                                    false
                                  } // Ensure the correct property name
                                  onChange={handleCheckboxChange}
                                  disabled={isDisabled}
                                  id={name}
                                  style={{ marginRight: "5px" }}
                                />
                                {label}
                              </label>
                            </Col>
                          ))}
                        </Row>
                        <Row>
                          <Col>
                            {formData.medical_mx?.mcdpa && (
                              <Form.Control
                                placeholder="MCDPA Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.manometry && (
                              <Form.Control
                                placeholder="MANOMETRY Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.diet && (
                              <Form.Control
                                placeholder="DIET Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.echo && (
                              <Form.Control
                                placeholder="ECHO Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {formData.medical_mx?.uroflowmetry && (
                              <Form.Control
                                placeholder="MRD Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.colo && (
                              <Form.Control
                                placeholder="COLO Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.xray && (
                              <Form.Control
                                placeholder="B12 Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.mri && (
                              <Form.Control
                                placeholder="USG Scrotum Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {formData.medical_mx?.cht && (
                              <Form.Control
                                placeholder="CHT Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.gastro && (
                              <Form.Control
                                placeholder="GASTRO Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.ct && (
                              <Form.Control
                                placeholder="D3 Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.doppler && (
                              <Form.Control
                                placeholder="DOPPLER Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {formData.medical_mx?.biofeedback && (
                              <Form.Control
                                placeholder="BIOFEEDBACK Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>

                          <Col>
                            {formData.medical_mx?.labInvestigation && (
                              <Form.Control
                                placeholder="USG Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.ultrasonography && (
                              <Form.Control
                                placeholder="USG Abdomen & Pelvis Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.medical_mx?.EchoAnalImaging && (
                              <Form.Control
                                placeholder="3D ENDO ANAL IMAGING Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row className="mb-3">
                    <Col md={10}>
                      <Form.Group>
                        <Form.Label>Other:</Form.Label>
                        <Row>
                          <Col md={4} className="d-flex flex-wrap">
                            <label className="d-flex align-items-center me-3">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="other.insurance"
                                checked={formData.other?.insurance}
                                onChange={handleCheckboxChange}
                                disabled={isDisabled}
                                id="insurance"
                                style={{ marginRight: "5px" }}
                              />
                              Insurance
                            </label>

                            <label className="d-flex align-items-center me-3">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="other.reimbursement"
                                checked={formData.other?.reimbursement}
                                onChange={handleCheckboxChange}
                                disabled={isDisabled}
                                id="reimbursement"
                                style={{ marginRight: "5px" }}
                              />
                              Reimbursement
                            </label>

                            <label className="d-flex align-items-center me-3">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="other.workshop"
                                checked={formData.other?.workshop}
                                onChange={handleCheckboxChange}
                                disabled={isDisabled}
                                id="workshop"
                                style={{ marginRight: "5px" }}
                              />
                              Workshop
                            </label>

                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="other.pdc"
                                checked={formData.other?.pdc}
                                onChange={handleCheckboxChange}
                                disabled={isDisabled}
                                id="pdc"
                                style={{ marginRight: "5px" }}
                              />
                              PDC
                            </label>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {formData.other?.insurance && (
                              <Form.Control
                                placeholder="INSURANCE Comment Box"
                                className="mt-2"
                              />
                            )}
                            {formData.other?.workshop && (
                              <Form.Control
                                placeholder="WORKSHOP Comment Box"
                                className="mt-2"
                              />
                            )}
                          </Col>
                          <Col>
                            {formData.other?.insurance && (
                              <>
                                <Form.Label>Insurance Company:</Form.Label>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="primary"
                                    as={Button}
                                  >
                                    {selectedAdviceOptions.advice.length > 0
                                      ? selectedAdviceOptions.advice.join(", ")
                                      : "Select Insurance Company"}
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    {surgicalAdviceOptions.map(
                                      (advice, index) => (
                                        <Dropdown.Item key={index} as="div">
                                          <Form.Check
                                            type="checkbox"
                                            label={advice}
                                            value={advice}
                                            checked={selectedAdviceOptions.advice.includes(
                                              advice
                                            )}
                                            onChange={() =>
                                              handleAdviceChange(advice)
                                            }
                                          />
                                        </Dropdown.Item>
                                      )
                                    )}
                                  </Dropdown.Menu>
                                </Dropdown>
                              </>
                            )}
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Consultant Name:</Form.Label>
                        <Form.Select
                          value={
                            selectedOptions?.consultantsDoctorName ||
                            previousRecord.consultantDoctor ||
                            ""
                          }
                          onChange={(e) => {
                            const selectedDoctorId = e.target.value; // Get the selected doctor ID

                            setSelectedOptions({
                              ...selectedOptions,
                              consultantsDoctorName: e.target.value,
                            });
                            setFormData({
                              ...formData,
                              consultantDoctor: selectedDoctorId, // Store the ID in formData
                            });
                          }}
                        >
                          <option value="">Select Consultant</option>
                          {[
                            ...new Set([
                              ...diagnosis.map(
                                (option) => option.consultantDoctorName
                              ),
                              ...consultantsDoctor.map(
                                (consultantsDoctor) => consultantsDoctor.name
                              ),
                            ]),
                          ].map((consultantDoctorName, index) => (
                            <option key={index} value={consultantDoctorName}>
                              {consultantDoctorName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Assistant Doctor:</Form.Label>
                        <Form.Select
                          value={
                            selectedOptions?.assistantsDoctorName ||
                            previousRecord.assistanceDoctor ||
                            ""
                          }
                          onChange={(e) => {
                            const selectedAssistantId = e.target.value; // Get the selected assistant ID

                            setSelectedOptions({
                              ...selectedOptions,
                              assistantsDoctorName: e.target.value,
                            });
                            setFormData({
                              ...formData,
                              assistanceDoctor: selectedAssistantId, // Store the ID in formData
                            });
                          }}
                        >
                          <option value="">Select Assistant</option>
                          {[
                            ...new Set([
                              ...diagnosis.map(
                                (option) => option.assistantsDoctorName
                              ),
                              ...assistantsDoctor.map(
                                (assistantsDoctor) => assistantsDoctor.name
                              ),
                            ]),
                          ].map((assistantsDoctorName, index) => (
                            <option key={index} value={assistantsDoctorName}>
                              {assistantsDoctorName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <div style={{ marginTop: "20px" }}>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={(e) => handleSubmit(e, false)}
                    >
                      Save New Record
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <style>
        {`
          .enquiry-card {
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            border: none;
            background: #f8f9fa;
            overflow: hidden;
            margin-bottom: 30px;
          }

          .card-body {
            padding: 30px;
          }

          .form-section {
            background: #ffffff;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 25px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 0.95rem;
          }

          .form-control, .form-select {
            border-radius: 8px;
            border: 3px solid #dee2e6;
            padding: 12px 15px;
            transition: all 0.3s ease;
            background-color: #ffffff;
            color: #2c3e50;
            font-size: 0.95rem;
          }

          .form-control:focus, .form-select:focus {
            border-color: #00bcd4;
            box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
            background-color: #f8F9FA;
          }

          textarea.form-control {
            min-height: 120px;
            resize: vertical;
          }

          .form-select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px 12px;
          }

          .btn-primary {
            background:linear-gradient(45deg, #00bcd4, #00acc1);
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.2);
          }

          .btn-primary:hover {
            background: linear-gradient(45deg, #00acc1, #0097a7);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 188, 212, 0.3);
          }

          .btn-primary:disabled {
            background: #bdc3c7;
            transform: none;
          }

          /* Error message styling */
          .error-message {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 5px;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .card-body {
              padding: 20px;
            }

            .form-section {
              padding: 15px;
            }

            .btn-primary {
              width: 100%;
              margin-top: 15px;
            }
          }

          /* Row spacing */
          .row {
            margin-bottom: 20px;
          }

          /* Spinner styling */
          .spinner-border {
            margin-right: 8px;
            width: 1.2rem;
            height: 1.2rem;
          }

          /* Optional: Add animation for form elements */
          .form-control, .form-select, .btn {
            animation: fadeIn 0.5s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Optional: Add hover effect for form controls */
          .form-control:hover, .form-select:hover {
            border-color: #3498db;
          }
        `}
      </style>
    </div>
  );
}
