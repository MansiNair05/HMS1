import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Container,
  Card,
  Table,
  Button,
  Dropdown,
} from "react-bootstrap";
import NavBarD from "./NavbarD";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "http://192.168.90.238:5000/api"; // Update with your backend API base URL

export default function DischargeCard() {
  const [discharge, setDischarge] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [types, setTypes] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [surgeons, setSurgeons] = useState([]);
  const [treatings, setTreatings] = useState([]);
  const [checks, setChecks] = useState([]);
  const [mades, setMades] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [injections, setInjections] = useState([]);
  const [adviceMedicineP, setdAdviceMedicineP] = useState([]);
  const [adviceMedicineU, setdAdviceMedicineU] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPrintButton, setShowPrintButton] = useState(false);
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [showEditButton, setShowEditButton] = useState(false); // Controls visibility of "Edit Diagnosis"
  const [isDisabled, setIsDisabled] = useState(false); // Controls edit mode
  const [disablePreviousButton, setDisablePreviousButton] = useState(false); // Disables "Previous Records" after clicking
  const [formData, setFormData] = useState({
    prescription_type: "",
    name: "",
    address: "",
    age: "",
    sex: "",
    consultantName: "",
    DOA: "",
    DOA_time: "",
    DOD: "",
    DOD_time: "",
    IPDNo: "",
    sPO2: "",
    BP: "",
    pulse: "",
    rr: "",
    temp: "",
    surgery_type: [],
    chife_complaints: "",
    past_history: "",
    surgical_history: "",
    allergies: "",
    surgery_procedure: "",
    surgery_note: "",
    investigation: "",
    diagnosis: "",
    local_care: "",
    carenote: "",
    dateOfIssue: "",
    assistanceDoctor: "",
    Follow_date: "",
    surgeonDoctor: "",
    madeby: "",
    checkedby: "",
    treatingby: "",
    surgeryadvice: "",
    treatmentGiven: "",
    adviceMedicine: "",
    medicine_quantity: "",
    injectionDetails: [],
    qty: "",
    days: "",
    timings: {
      BeforeBreakfast: false,
      AfterBreakfast: false,
      BeforeLunch: false,
      AfterLunch: false,
      BeforeDinner: false,
      AfterDinner: false,
      AfterEveningSnacks: false,
    },
    medicine_days: "",
    medicine_name: "",
    medicineType: "",
    medicalStrength: "",
    medicineUnit: "",
    medicineRoute: "",
    medicineStatus: "",
    times: "",
  });

  const [dropdownOptions, setDropdownOptions] = useState([]); // Store API options
  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected checkboxes

  // Fetch options from API
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/V1/patienttabsdp/consultant_dropdown",
            setter: setConsultants,
          },
          {
            url: "/V1/patienttabsdp/surgeryType_dropdown",
            setter: setTypes,
          },
          {
            url: "/V1/patienttabsdp/assistantDoc_dropdown",
            setter: setAssistants,
          },
          {
            url: "/V1/patienttabsdp/surgeon_dropdown",
            setter: setSurgeons,
          },
          {
            url: "/V1/patienttabsdp/surgeon_dropdown",
            setter: setTreatings,
          },
          {
            url: "/V1/patienttabsdp/surgeryAdvice_dropdown",
            setter: setSurgeries,
          },
          {
            url: "/V1/patienttabsdp/checkedBy_dropdown",
            setter: setChecks,
          },
          {
            url: "/V1/patienttabsdp/madeby_dropdown",
            setter: setMades,
          },
          {
            url: "/V1/patienttabsdp/injection_dropdown",
            setter: setInjections,
          },
          {
            url: "/V1/patienttabsdp/proctologyMedicine_dropdown",
            setter: setdAdviceMedicineP,
          },
          {
            url: "/V1/patienttabsdp/urologyMedicine_dropdown",
            setter: setdAdviceMedicineU,
          },
        ];

        const fetchPromises = endpoints.map(async ({ url, setter }) => {
          const response = await fetch(`${BASE_URL}${url}`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(
              `Error fetching ${url}: ${data.message || "Unknown error"}`
            );
          }
          setter(data.data || []);
        });

        await Promise.all(fetchPromises);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedPatientId");
    console.log("Retrieved from localStorage:", storedPatientId);
    if (storedPatientId) setPatientId(storedPatientId);
  }, []);

  // Initial useEffect to fetch basic patient details
  // useEffect(() => {
  //   if (!patientId) {
  //     console.warn("No patientId found, skipping fetch");
  //     return;
  //   }

  //   const fetchInitialPatientData = async () => {
  //     try {
  //       console.log("Fetching initial patient data for ID:", patientId);

  //       const response = await fetch(
  //         `${BASE_URL}/V1/dischargeCard/listDischargeCard/${patientId}`
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch patient details");
  //       }

  //       const result = await response.json();
  //       console.log("Initial patient data response:", result);

  //       // Extract patient data from the response
  //       const patientData = result.data?.patientData?.[0];

  //       if (patientData) {
  //         // Set only the basic patient details
  //         setFormData((prevState) => ({
  //           ...prevState,
  //           name: patientData.name || "",
  //           age: patientData.age || "",
  //           sex: patientData.sex || "", // Note: API uses 'sex' instead of 'sex'
  //           address: patientData.address || "",

  //           consultantName: "",
  //           DOA: "",
  //           DOA_time: "",
  //           DOD: "",
  //           DOD_time: "",
  //           IPDNo: "",
  //           sPO2: "",
  //           BP: "",
  //           pulse: "",
  //           rr: "",
  //           temp: "",
  //           surgery_type: "",
  //           chife_complaints: "",
  //           past_history: "",
  //           surgical_history: "",
  //           allergies: "",
  //           surgery_procedure: "",
  //           surgery_note: "",
  //           investigation: "",
  //           diagnosis: "",
  //           local_care: "",
  //           carenote: "",
  //           dateOfIssue: "",
  //           assistanceDoctor: "",
  //           Follow_date: "",
  //           surgeonDoctor: "",
  //           madeby: "",
  //           checkedby: "",
  //           treatingby: "",
  //           surgeryadvice: "",
  //           treatmentGiven: "",
  //           adviceMedicine: "",
  //           medicine_quantity: "",
  //           injectionDetails: [],
  //           dischargeTreat: [],
  //           timings: {
  //             BeforeBreakfast: false,
  //             AfterBreakfast: false,
  //             BeforeLunch: false,
  //             AfterLunch: false,
  //             BeforeDinner: false,
  //             AfterDinner: false,
  //             AfterEveningSnacks: false,
  //           },
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching initial patient data:", error);
  //     }
  //   };

  //   fetchInitialPatientData();
  // }, [patientId]);

  // useEffect(() => {
  //   if (!patientId) {
  //     console.warn("No patientId found, skipping fetch");
  //     return;
  //   }
  //   const fetchPatientData = async () => {
  //     if (!patientId) {
  //       console.error("No patient ID available for fetching data.");
  //       return;
  //     }

  //     try {
  //       console.log("Fetching data for patient ID:", patientId);

  //       const response = await fetch(
  //         `${BASE_URL}/V1/dischargeCard/listDischargeCard/${patientId}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         console.error(
  //           "API Response Error:",
  //           response.status,
  //           await response.text()
  //         );
  //         return;
  //       }

  //       if (response.ok) {
  //         const data = await response.json();
  //         // Initialize form data with properly formatted dates
  //         const formattedData = {
  //           ...data,
  //           birth_date: data.birth_date
  //             ? new Date(data.birth_date).toISOString().split("T")[0]
  //             : null,
  //           DOA: data.DOA
  //             ? new Date(data.DOA).toISOString().split("T")[0]
  //             : null,
  //           DOD: data.DOD
  //             ? new Date(data.DOD).toISOString().split("T")[0]
  //             : null,
  //           dateOfIssue: data.dateOfIssue
  //             ? new Date(data.dateOfIssue).toISOString().split("T")[0]
  //             : null,
  //           Follow_date: data.Follow_date
  //             ? new Date(data.Follow_date).toISOString().split("T")[0]
  //             : null,
  //         };
  //         setFormData(formattedData);
  //       }

  //       const data = await response.json();
  //       console.log("Fetched Data:", data);

  //       if (data?.data?.patientData) {
  //         // Set basic patient details
  //         setFormData((prevState) => ({
  //           ...prevState,
  //           name: data.data.patientData.name || "",
  //           age: data.data.patientData.age || "",
  //           sex: data.data.patientData.sex || "",
  //           address: data.data.patientData.address || "",
  //         }));
  //       }

  //       // Set discharge card data if available
  //       if (data?.data?.dischargeCardData) {
  //         setFormData((prevState) => ({
  //           ...prevState,
  //           ...data.data.dischargeCardData,
  //           timings: data.data.dischargeCardData.timings || {
  //             BeforeBreakfast: false,
  //             AfterBreakfast: false,
  //             BeforeLunch: false,
  //             AfterLunch: false,
  //             BeforeDinner: false,
  //             AfterDinner: false,
  //             AfterEveningSnacks: false,
  //           },
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchPatientData();
  // }, [patientId]);
  const handleSaveMedicine = async () => {
    try {
      console.log("Submitting medicine data:", formData); // ✅ Check if formData has the correct fields

      const response = await fetch(`${BASE_URL}/V1/medicine/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Log response status and body
      console.log("Response Status:", response.status);

      const data = await response.json(); // ✅ Attempt to parse response
      console.log("API Response Data:", data); // ✅ Log response from API

      if (!response.ok) {
        throw new Error(data.message || "Failed to save medicine data");
      }

      console.log("Medicine saved successfully:", data);

      // Update UI without reloading
      setTableData((prevData) => [...prevData, formData]);

      // Close the popup
      setShowPopup(false);
    } catch (error) {
      console.error("Error saving medicine:", error);
      alert(`Error: ${error.message || "Failed to save medicine. Try again!"}`);
    }
  };

  useEffect(() => {
    if (!patientId) {
      console.warn("No patientId found, skipping fetch");
      return;
    }

    const fetchPatientData = async () => {
      try {
        console.log("Fetching data for patient ID:", patientId);

        const response = await fetch(
          `${BASE_URL}/V1/dischargeCard/listDischargeCard/${patientId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
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
        console.log("Fetched Data:", data);

        // Extract patient data
        const patientData = data?.data?.patientData?.[0];

        // Set only basic patient details initially
        const basicDetails = {
          name: patientData?.name || "",
          age: patientData?.age || "",
          sex: patientData?.sex || "",
          address: patientData?.address || "",
          prescription_type: "",
        };

        // Set form data with only basic details
        setFormData((prevState) => ({
          ...prevState,
          ...basicDetails,
          // Reset all other fields
          consultantName: "",
          DOA: "",
          DOA_time: "",
          DOD: "",
          DOD_time: "",
          IPDNo: "",
          sPO2: "",
          BP: "",
          pulse: "",
          rr: "",
          temp: "",
          surgery_type: "",
          chife_complaints: "",
          past_history: "",
          surgical_history: "",
          allergies: "",
          surgery_procedure: "",
          surgery_note: "",
          investigation: "",
          diagnosis: "",
          local_care: "",
          carenote: "",
          dateOfIssue: "",
          assistanceDoctor: "",
          Follow_date: "",
          surgeonDoctor: "",
          madeby: "",
          checkedby: "",
          treatingby: "",
          surgeryadvice: "",
          treatmentGiven: "",
          adviceMedicine: "",
          medicine_quantity: "",
          injectionDetails: [],
          dischargeTreat: [],
          timings: {
            BeforeBreakfast: false,
            AfterBreakfast: false,
            BeforeLunch: false,
            AfterLunch: false,
            BeforeDinner: false,
            AfterDinner: false,
            AfterEveningSnacks: false,
          },
        }));

        // Store the full response data for use in fetchPreviousRecords
        window.fullPatientData = data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Track formData updates
  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

  // Handle checkbox change for both timings and work patterns
  const handleCheckboxChange = (e, type) => {
    const { name, checked } = e.target;
    if (type === "timings") {
      setFormData((prev) => ({
        ...prev,
        timings: {
          ...prev.timings,
          [name]: checked,
        },
      }));
    } else if (type === "workPatterns") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Fields that should only accept numbers
    const numericFields = ["age", "IPDNo", "sPO2", "BP", "pulse", "rr", "temp"];

    if (numericFields.includes(name)) {
      // Allow only numbers using regex
      if (!/^\d*$/.test(value)) {
        return; // Prevents setting non-numeric values
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddToTable = () => {
    if (
      (!formData.adviceMedicine, !formData.medicine_quantity, !formData.days)
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const newRow = {
      medicine: formData.adviceMedicine,
      qty: formData.medicine_quantity,
      mealTimings:
        Object.keys(formData.timings)
          .filter((timing) => formData.timings[timing])
          .join(", ") || "None",
      days: formData.days,
    };

    setTableData((prevData) => [...prevData, newRow]);
    setFormData((prev) => ({
      ...prev,
      adviceMedicine: "",
      medicine_quantity: "",
      days: "",
    }));
  };

  const addInjectionDetails = () => {
    if (
      !formData.treatmentGiven ||
      !formData.times ||
      !formData.medicineRoute
    ) {
      alert("Please fill in all required fields before adding an injection.");
      return;
    }

    const newInjection = {
      treatmentGiven: formData.treatmentGiven,
      timesGiven: formData.times,
      medicineRoute: formData.medicineRoute,
    };

    setFormData((prev) => ({
      ...prev,
      injectionDetails: [...(prev.injectionDetails || []), newInjection],
      treatmentGiven: "", // Clear the input after adding
      times: "",
      medicineRoute: "",
    }));
  };

  const removeInjection = (index) => {
    setFormData((prev) => ({
      ...prev,
      injectionDetails: prev.injectionDetails.filter((_, i) => i !== index),
    }));
  };

  const addDischargeTreatDetails = () => {
    if (
      !formData.adviceMedicine ||
      !formData.medicine_quantity ||
      !formData.medicine_days
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      dischargeTreat: [
        ...(prev.dischargeTreat || []),
        {
          adviceMedicine: prev.adviceMedicine,
          medicine_quantity: prev.medicine_quantity,
          medicine_days: prev.medicine_days,
          mealTimings:
            Object.keys(prev.timings)
              .filter((timing) => prev.timings[timing])
              .join(", ") || "None",
        },
      ],
      adviceMedicine: "",
      medicine_quantity: "",
      medicine_days: "",
      timings: Object.fromEntries(
        Object.keys(prev.timings).map((key) => [key, false])
      ),
    }));
  };
  const removeDischarge = (index) => {
    setFormData((prev) => ({
      ...prev,
      dischargeDetails: prev.dischargeDetails.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        patientId: patientId,
        ...formData,
        is_deleted: 0,
        doctor_id: localStorage.getItem("doctor_id") || "",
        creation_timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        `${BASE_URL}/V1/dischargeCard/addDischargeCard/${patientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      // First update the states
      setIsDisabled(true);
      setShowEditButton(true);
      setDisablePreviousButton(true);

      // Then show the alert
      alert("Discharge Card submitted successfully!");
    } catch (error) {
      console.error("Error saving discharge card:", error);
    }
  };

  // Handle checkbox selection change for test type
const handleSurgeryTypeChange = (e, surgeryType) => {
  const { checked } = e.target;

  setFormData((prevState) => {
    const updatedSurgeryTypes = checked
      ? [...prevState.surgery_type, surgeryType]
      : prevState.surgery_type.filter((type) => type !== surgeryType);

    return { ...prevState, surgery_type: updatedSurgeryTypes };
  });
};


  const [previousRecordDate, setPreviousRecordDate] = useState("");
  // const fetchPreviousRecords = async () => {
  //   try {
  //     console.log("Fetching previous records for patientId:", patientId);

  //     const response = await fetch(
  //       `${BASE_URL}/V1/dischargeCard/listDischargeCard/${patientId}`
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch previous records");
  //     }

  //     const result = await response.json();
  //     console.log("Previous Records Data:", result);

  //     if (!result?.data?.dischargeCardData) {
  //       alert("No previous records found.");
  //       return;
  //     }

  //     const dischargeCard = result.data.dischargeCardData;
  //     const patientData = result.data.patientData?.[0];

  //     // Log the data we're working with
  //     console.log("Discharge Card Data:", dischargeCard);
  //     console.log("Patient Data:", patientData);

  //     // Update form data
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       // Patient basic details
  //       name: patientData?.name || "",
  //       age: patientData?.age || "",
  //       sex: patientData?.sex || "",
  //       address: patientData?.address || "",

  //       // Dropdown values
  //       prescription_type: dischargeCard?.prescription_type || "",
  //       consultantName: dischargeCard?.consultant_name || "",
  //       surgery_type: dischargeCard?.surgery_type || "",
  //       assistanceDoctor: dischargeCard?.assistanceDoctor || "",
  //       surgeonDoctor: dischargeCard?.surgeonDoctor || "",
  //       madeby: dischargeCard?.madeby || "",
  //       checkedby: dischargeCard?.checkedby || "",
  //       treatingby: dischargeCard?.treatingby || "",
  //       surgeryadvice: dischargeCard?.surgeryadvice || "",

  //       // Other discharge card details
  //       DOA: formatDate(dischargeCard?.DOA) || "",
  //       DOA_time: dischargeCard?.DOA_time || "",
  //       DOD: formatDate(dischargeCard?.DOD) || "",
  //       DOD_time: dischargeCard?.DOD_time || "",
  //       IPDNo: dischargeCard?.IPDNo || "",
  //       sPO2: dischargeCard?.sPO2 || "",
  //       BP: dischargeCard?.BP || "",
  //       pulse: dischargeCard?.pulse || "",
  //       rr: dischargeCard?.rr || "",
  //       temp: dischargeCard?.temp || "",
  //       past_history: dischargeCard?.past_history || "",
  //       allergies: dischargeCard?.allergies || "",
  //       surgery_note: dischargeCard?.surgery_note || "",
  //       investigation: dischargeCard?.investigation || "",
  //       chife_complaints: dischargeCard?.chife_complaints || "",
  //       hb: dischargeCard?.hb || "",
  //       wbc: dischargeCard?.wbc || "",
  //       hiv: dischargeCard?.hiv || "",
  //       hbsag: dischargeCard?.hbsag || "",
  //       hcv: dischargeCard?.hcv || "",
  //       plt: dischargeCard?.plt || "",
  //       bsl: dischargeCard?.bsl || "",
  //       creatinine: dischargeCard?.creatinine || "",
  //       billirubin: dischargeCard?.billirubin || "",
  //       urine: dischargeCard?.urine || "",
  //       psa: dischargeCard?.psa || "",
  //       bt: dischargeCard?.bt || "",
  //       ct: dischargeCard?.ct || "",
  //       pt: dischargeCard?.pt || "",
  //       inr: dischargeCard?.inr || "",
  //       diagnosis: dischargeCard?.diagnosis || "",
  //       local_care: dischargeCard?.local_care || "",
  //       carenote: dischargeCard?.carenote || "",
  //       dateOfIssue: formatDate(dischargeCard?.dateOfIssue) || "",
  //       Follow_date: formatDate(dischargeCard?.Follow_date) || "",
  //       treatmentGiven: dischargeCard?.treatmentGiven || "",
  //     }));

  //     // Update selected options for dropdowns
  //     setSelectedOptions({
  //       prescription_type: dischargeCard?.prescription_type || "",
  //       consultantName: dischargeCard?.consultant_name || "",
  //       surgery_type: dischargeCard?.surgery_type
  //         ? [dischargeCard.surgery_type]
  //         : [],
  //       assistanceDoctor: dischargeCard?.assistanceDoctor || "",
  //       surgeonDoctor: dischargeCard?.surgeonDoctor || "",
  //       madeby: dischargeCard?.madeby || "",
  //       checkedby: dischargeCard?.checkedby || "",
  //       treatingby: dischargeCard?.treatingby || "",
  //       surgeryadvice: dischargeCard?.surgeryadvice || "",
  //     });

  //     // Update medicine-related dropdowns if available
  //     if (result.data.medicineData?.length > 0) {
  //       const medicineData = result.data.medicineData[0];
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         adviceMedicine: medicineData.medicine_name || "",
  //         medicine_quantity: medicineData.quantity || "",
  //         medicine_days: medicineData.days || "",
  //         timings: medicineData.timings || {
  //           BeforeBreakfast: false,
  //           AfterBreakfast: false,
  //           BeforeLunch: false,
  //           AfterLunch: false,
  //           BeforeDinner: false,
  //           AfterDinner: false,
  //           AfterEveningSnacks: false,
  //         },
  //       }));
  //     }

  //     // Update injection details if available
  //     if (dischargeCard?.injectionDetails?.length > 0) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         injectionDetails: dischargeCard.injectionDetails,
  //       }));
  //     }

  //     // Show the "Edit Diagnosis" button
  //     setShowEditButton(true);
  //     // Show Print button when previous records are fetched
  //     setShowPrintButton(true);
  //     // Disable "Previous Records" button after clicking it
  //     setDisablePreviousButton(true);
  //     // Disable form fields
  //     setIsDisabled(true);

  //     console.log("Updated form data:", formData);
  //     console.log("Updated selected options:", selectedOptions);

  //     setPreviousRecordDate(dischargeCard.dateOfIssue || "");
  //   } catch (error) {
  //     console.error("Error fetching previous records:", error);
  //     alert("Failed to fetch previous records.");
  //   }
  // };

  // Add the parseDate helper function at the top of your component:

  // Modify fetchPreviousRecords to use stored data
  const fetchPreviousRecords = async () => {
    try {
      if (!window.fullPatientData) {
        console.error("No previous data available");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/V1/dischargeCard/listDischargeCard/${patientId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch previous records");
      }

      const result = window.fullPatientData;
      console.log("Previous Records Data:", result);

      if (!result?.data?.dischargeCardData) {
        alert("No previous records found.");
        return;
      }

      const dischargeCard = result.data.dischargeCardData;
      const patientData = result.data.patientData?.[0];

      // Log the data we're working with
      console.log("Discharge Card Data:", dischargeCard);
      console.log("Patient Data:", patientData);

      // Update form data with all fields
      setFormData((prevData) => ({
        ...prevData,
        // Patient basic details
        name: patientData?.name || "",
        age: patientData?.age || "",
        sex: patientData?.sex || "",
        address: patientData?.address || "",

        // All other fields from dischargeCard
        prescription_type: dischargeCard?.prescription_type || "",
        consultantName: dischargeCard?.consultant_name || "",
        surgery_type: dischargeCard?.surgery_type || "",
        assistanceDoctor: dischargeCard?.assistanceDoctor || "",
        surgeonDoctor: dischargeCard?.surgeonDoctor || "",
        madeby: dischargeCard?.madeby || "",
        checkedby: dischargeCard?.checkedby || "",
        treatingby: dischargeCard?.treatingby || "",
        surgeryadvice: dischargeCard?.surgeryadvice || "",

        // Other discharge card details
        // DOA: formatDate(dischargeCard?.DOA) || "",
        DOA_time: dischargeCard?.DOA_time || "",
        // DOD: formatDate(dischargeCard?.DOD) || "",
        DOD_time: dischargeCard?.DOD_time || "",
        IPDNo: dischargeCard?.IPDNo || "",
        sPO2: dischargeCard?.sPO2 || "",
        BP: dischargeCard?.BP || "",
        pulse: dischargeCard?.pulse || "",
        rr: dischargeCard?.rr || "",
        temp: dischargeCard?.temp || "",
        past_history: dischargeCard?.past_history || "",
        allergies: dischargeCard?.allergies || "",
        surgery_note: dischargeCard?.surgery_note || "",
        investigation: dischargeCard?.investigation || "",
        chife_complaints: dischargeCard?.chife_complaints || "",
        hb: dischargeCard?.hb || "",
        wbc: dischargeCard?.wbc || "",
        hiv: dischargeCard?.hiv || "",
        hbsag: dischargeCard?.hbsag || "",
        hcv: dischargeCard?.hcv || "",
        plt: dischargeCard?.plt || "",
        bsl: dischargeCard?.bsl || "",
        creatinine: dischargeCard?.creatinine || "",
        billirubin: dischargeCard?.billirubin || "",
        urine: dischargeCard?.urine || "",
        psa: dischargeCard?.psa || "",
        bt: dischargeCard?.bt || "",
        ct: dischargeCard?.ct || "",
        pt: dischargeCard?.pt || "",
        inr: dischargeCard?.inr || "",
        diagnosis: dischargeCard?.diagnosis || "",
        local_care: dischargeCard?.local_care || "",
        carenote: dischargeCard?.carenote || "",
        // dateOfIssue: formatDate(dischargeCard?.dateOfIssue) || "",
        // Follow_date: formatDate(dischargeCard?.Follow_date) || "",
        treatmentGiven: dischargeCard?.treatmentGiven || "",
        DOA: formatDate(dischargeCard?.DOA), // ✅ Ensures valid date format
        DOD: formatDate(dischargeCard?.DOD),
        dateOfIssue: formatDate(dischargeCard?.dateOfIssue),
        Follow_date: formatDate(dischargeCard?.Follow_date),
      }));

      // Update selected options and other states
      setSelectedOptions({
        prescription_type: dischargeCard?.prescription_type || "",
        consultantName: dischargeCard?.consultant_name || "",
        surgery_type: dischargeCard?.surgery_type
          ? [dischargeCard.surgery_type]
          : [],
        assistanceDoctor: dischargeCard?.assistanceDoctor || "",
        surgeonDoctor: dischargeCard?.surgeonDoctor || "",
        madeby: dischargeCard?.madeby || "",
        checkedby: dischargeCard?.checkedby || "",
        treatingby: dischargeCard?.treatingby || "",
        surgeryadvice: dischargeCard?.surgeryadvice || "",
      });

      // Update medicine-related dropdowns if available
      if (result.data.medicineData?.length > 0) {
        const medicineData = result.data.medicineData[0];
        setFormData((prevData) => ({
          ...prevData,
          adviceMedicine: medicineData.medicine_name || "",
          medicine_quantity: medicineData.quantity || "",
          medicine_days: medicineData.days || "",
          timings: medicineData.timings || {
            BeforeBreakfast: false,
            AfterBreakfast: false,
            BeforeLunch: false,
            AfterLunch: false,
            BeforeDinner: false,
            AfterDinner: false,
            AfterEveningSnacks: false,
          },
        }));
      }

      // Update injection details if available
      if (dischargeCard?.injectionDetails?.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          injectionDetails: dischargeCard.injectionDetails,
        }));
      }

      // Show relevant buttons and disable form
      setShowEditButton(true);
      setShowPrintButton(true);
      setDisablePreviousButton(true);
      setIsDisabled(true);

      console.log("Updated form data:", formData);
      console.log("Updated selected options:", selectedOptions);

      setPreviousRecordDate(dischargeCard.dateOfIssue || "");
    } catch (error) {
      console.error("Error fetching previous records:", error);
      alert("Failed to fetch previous records.");
    }
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      // Handle DD/MM/YYYY format
      if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/");
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split("T")[0];
        }
      }
      // Try parsing as regular date string
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }

      console.error("Invalid date:", dateString);
      return "";
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Enable form editing when "Edit Diagnosis" is clicked
  const handleEditDischargeCard = () => {
    setIsDisabled(false);
    alert("Editing mode enabled. You can now modify the diagnosis details.");
  };

  const handleNewRecord = () => {
    // Preserve patient basic details
    const basicDetails = {
      name: formData.name,
      age: formData.age,
      address: formData.address,
      sex: formData.sex,
      prescription_type: "", // Reset prescription type
    };

    // Reset form but keep basic details
    setFormData({
      ...basicDetails,
      consultantName: "",
      DOA: "",
      DOD: "",
      DOD_time: "",
      DOA_time: "",
      surgery_type: "",
      chife_complaints: "",
      past_history: "",
      surgical_history: "",
      allergies: "",
      surgical_procedure: "",
      surgeryNote: "",
      diagnosis: "",
      local_care: "",
      carenote: "",
      dateOfIssue: "",
      assistanceDoctor: "",
      Follow_date: "",
      surgeonDoctor: "",
      madeby: "",
      checkedby: "",
      treatingby: "",
      surgeryadvice: "",
      adviceMedicine: "",
      medicine_quantity: "",
      injectionDetails: [],
      dischargeTreat: [],
      investigation: "",
      IPDNo: "",
      sPO2: "",
      BP: "",
      pulse: "",
      rr: "",
      temp: "",
      treatmentGiven: "",
      times: "",
      medicineRoute: "",
      timings: {
        BeforeBreakfast: false,
        AfterBreakfast: false,
        BeforeLunch: false,
        AfterLunch: false,
        BeforeDinner: false,
        AfterDinner: false,
        AfterEveningSnacks: false,
      },
    });
    // Reset selected options
    setSelectedOptions({});

    // Reset UI states
    setShowEditButton(false);
    setDisablePreviousButton(false);
    setIsDisabled(false);
    alert("New Record: You can now enter new data.");
    setShowPrintButton(false);
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startTime = new Date();
    startTime.setHours(5, 0, 0); // 5:00 AM
    const endTime = new Date();
    endTime.setHours(23, 45, 0); // 11:45 PM

    while (startTime <= endTime) {
      // Format time in 12-hour format with AM/PM
      const timeString = startTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      slots.push(timeString);

      // Add 15 minutes
      startTime.setMinutes(startTime.getMinutes() + 15);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();
  const handlePrint = () => {
    window.print();
  };
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
      <NavBarD pagename="Discharge Card" />
      <Container fluid>
        <Col>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
              borderColor: "#00bcd4",
              background: "#f8f9fa",
              border: "3px solid #00bcd4",
              padding: "20px",
            }}
          >
            <Card.Body>
              <Form>
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
                      onClick={handleEditDischargeCard}
                    >
                      Edit Discharge Card
                    </button>
                  )}
                  {/* Print Button - Only Visible After Clicking "Previous Records" */}
                  {showPrintButton && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ float: "right", marginRight: "7px" }}
                      onClick={handlePrint}
                    >
                      Print
                    </button>
                  )}
                </div>
                {/* Show the previous record date when available */}
                {previousRecordDate && (
                  <div style={{ marginTop: "15px" }}>
                    <strong>Previous Record Date: </strong>
                    <span>{previousRecordDate}</span>
                  </div>
                )}
                <br />
                <Row>
                  <Col md={3} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Prescription Type</Form.Label>
                      <Form.Control
                        as="select"
                        name="prescription_type"
                        value={formData.prescription_type}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      >
                        <option value="">Prescription Type</option>
                        <option value="Proctology">Proctology</option>
                        <option value="Urology">Urology</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  {/* Patient Name */}
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Patient Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                  {/* Address */}
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        placeholder="Enter Address"
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={2} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="text"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                  {/* sex */}
                  <Col md={3} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        type="text"
                        name="sex"
                        value={formData.sex || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z]*$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Group controlId="consultantName">
                      <Form.Label>Consultant Name</Form.Label>
                      <Form.Select
                        value={selectedOptions?.consultantName || ""}
                        onChange={(e) =>
                          setSelectedOptions({
                            ...selectedOptions,
                            consultantName: e.target.value,
                          })
                        }
                        disabled={isDisabled}
                      >
                        <option value="">Select Consultant</option>
                        {[
                          ...new Set([
                            ...discharge.map((option) => option.consultantName),
                            ...consultants.map((consultant) => consultant.name),
                          ]),
                        ].map((consultantName, index) => (
                          <option key={index} value={consultantName}>
                            {consultantName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  {/* DOA */}
                  <Col md={2} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label className="d-block">DOA</Form.Label>
                      <DatePicker
                        // selected={formData?.DOA ? new Date(formData.DOA) : null}
                        selected={parseDate(formData?.DOA)}
                        onChange={(date) => {
                          handleInputChange({
                            target: {
                              name: "DOA",
                              value: date
                                ? date.toISOString().split("T")[0]
                                : null,
                            },
                          });
                        }}
                        className="form-control"
                        placeholderText="Select DOA"
                        maxDate={new Date()}
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
                  {/* Time */}
                  {/* <Col md={2} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label className="d-block">Time</Form.Label>
                      <Form.Control
                        as="select"
                        name="DOA_time"
                        value={formData.DOA_time}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      >
                        <option value="">Time</option>
                        {timeSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col> */}
                  <Col md={2} className="mb-4">
                    <Form.Group controlId="surgery_type">
                      <Form.Label>Surgery Type</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="secondary"
                          id="dropdown-basic"
                        >
                          {Array.isArray(formData.surgery_type) &&
                          formData.surgery_type.length > 0
                            ? formData.surgery_type.join(", ")
                            : "Select Surgery Types"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ padding: "10px" }}>
                          {[
                            "LHP",
                            "FILAC",
                            "MIPH",
                            "SPHINCTEROTOMY",
                            "GYNAECOMASTIA",
                            "PROCTITIS",
                            "VARICOSE VEINS",
                            "CIRCUMCISION",
                            "HERNIA",
                            "UROLOGY",
                            "LAP CHOLECYSTECTOMY",
                            "STARR",
                          ].map((surgery_type, index) => (
                            <Form.Check
                              key={index}
                              type="checkbox"
                              label={surgery_type}
                              value={surgery_type}
                              checked={
                                formData.surgery_type?.includes(surgery_type) ||
                                false
                              }
                              onChange={(e) =>
                                handleSurgeryTypeChange(e, surgery_type)
                              }
                            />
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  {/* DOD */}
                  <Col md={2} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label className="d-block">DOD</Form.Label>
                      <DatePicker
                        // selected={formData?.DOD ? new Date(formData.DOD) : null}
                        selected={parseDate(formData?.DOD)}
                        onChange={(date) => {
                          handleInputChange({
                            target: {
                              name: "DOD",
                              value: date
                                ? date.toISOString().split("T")[0]
                                : "",
                            },
                          });
                        }}
                        // dateFormat="yyyy-MM-dd"
                        className="form-control"
                        placeholderText="Select DOD"
                        maxDate={new Date()}
                        showYearDropdown
                        dropdownMode="select"
                        style={{
                          height: "38px",
                          width: "100%",
                        }}
                      />
                    </Form.Group>
                  </Col>
                  {/* Time */}
                  <Col md={2} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Time</Form.Label>
                      <Form.Control
                        as="select"
                        name="DOD_time"
                        value={formData.DOD_time}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      >
                        <option value="">Time</option>
                        {timeSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>IPD No</Form.Label>
                      <Form.Control
                        type="text"
                        name="IPDNo"
                        value={formData.IPDNo}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>SPO2</Form.Label>
                      <Form.Control
                        type="text"
                        name="sPO2"
                        value={formData.sPO2}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>BP</Form.Label>
                      <Form.Control
                        type="text"
                        name="BP"
                        value={formData.BP}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={1} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Pulse</Form.Label>
                      <Form.Control
                        type="text"
                        name="pulse"
                        value={formData.pulse}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>RR</Form.Label>
                      <Form.Control
                        type="text"
                        name="rr"
                        value={formData.rr}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Temp</Form.Label>
                      <Form.Control
                        type="text"
                        name="temp"
                        value={formData.temp}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Reason For Admission</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="chife_complaints"
                        value={formData.chife_complaints}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Past Medical History</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="past_history"
                        value={formData.past_history}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Significant Findings</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="surgical_history"
                        value={formData.surgical_history}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Known Allergies</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Surgery Details</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="surgery_procedure"
                        value={formData.surgery_procedure}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Surgery Note</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="surgery_note"
                        value={formData.surgery_note}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={6}>
                    <Form.Label>Investigation:</Form.Label>
                    <Row>
                      <Col md={2} className="mb-4">
                        <Form.Label>HB</Form.Label>
                        <Form.Control
                          type="text"
                          name="hb"
                          value={formData.hb || ""}
                          onChange={handleInputChange}
                          style={{ borderRadius: "6px" }}
                        />
                      </Col>
                      <Col md={2} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>WBC</Form.Label>
                          <Form.Control
                            type="text"
                            name="wbc"
                            value={formData.wbc}
                            onChange={handleInputChange}
                            style={{ borderRadius: "6px" }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>PLT</Form.Label>
                          <Form.Control
                            type="text"
                            name="plt"
                            value={formData.plt}
                            onChange={handleInputChange}
                            style={{ borderRadius: "6px" }}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={2} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>BSL</Form.Label>
                          <Form.Control
                            type="text"
                            name="bsl"
                            value={formData.bsl}
                            onChange={handleInputChange}
                            style={{ borderRadius: "6px" }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>SR.Creatinine</Form.Label>
                          <Form.Control
                            type="text"
                            name="creatinine"
                            value={formData.creatinine}
                            onChange={handleInputChange}
                            style={{ borderRadius: "6px" }}
                          />
                        </Form.Group>
                      </Col>
                      <Row>
                        <Col md={4} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Billirubin</Form.Label>
                            <Form.Control
                              type="text"
                              name="billirubin"
                              value={formData.billirubin}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Urine</Form.Label>
                            <Form.Control
                              type="text"
                              name="urine"
                              value={formData.urine}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>PSA</Form.Label>
                            <Form.Control
                              type="text"
                              name="psa"
                              value={formData.psa}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>BT</Form.Label>
                            <Form.Control
                              type="text"
                              name="bt"
                              value={formData.bt}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>CT</Form.Label>
                            <Form.Control
                              type="text"
                              name="ct"
                              value={formData.ct}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>PT</Form.Label>
                            <Form.Control
                              type="text"
                              name="pt"
                              value={formData.pt}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>INR</Form.Label>
                            <Form.Control
                              type="text"
                              name="inr"
                              value={formData.inr}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>HIV</Form.Label>
                            <Form.Control
                              type="text"
                              name="hiv"
                              placeholder="negative"
                              value={formData.hiv}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>HCV</Form.Label>
                            <Form.Control
                              type="text"
                              name="hcv"
                              value={formData.hcv}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>HBSAG</Form.Label>
                            <Form.Control
                              type="text"
                              name="hbsag"
                              value={formData.hbsag}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Control
                              as="textarea"
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                              disabled={isDisabled}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col md={12} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Note / Advice</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="carenote"
                              value={formData.carenote || ""}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                              disabled={isDisabled}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />
                      <br />
                      <Row>
                        <Col md={6} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label className="d-block">
                              Date Of Issue
                            </Form.Label>
                            <DatePicker
                              selected={parseDate(formData?.dateOfIssue)}
                              onChange={(date) => {
                                handleInputChange({
                                  target: {
                                    name: "dateOfIssue",
                                    value: date
                                      ? date.toISOString().split("T")[0]
                                      : null,
                                  },
                                });
                              }}
                              dateFormat="yyyy-MM-dd"
                              className="form-control"
                              placeholderText="Select Date Of Issue"
                              maxDate={new Date()}
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
                      </Row>

                      <Row>
                        <Col md={6} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label className="d-block">
                              Follow Up Date
                            </Form.Label>
                            <DatePicker
                              selected={parseDate(formData?.Follow_date)}
                              onChange={(date) => {
                                handleInputChange({
                                  target: {
                                    name: "Follow_date",
                                    value: date
                                      ? date.toISOString().split("T")[0]
                                      : null,
                                  },
                                });
                              }}
                              dateFormat="yyyy-MM-dd"
                              className="form-control"
                              placeholderText="Select Follow Date"
                              maxDate={new Date()}
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
                      </Row>
                      <Row>
                        <Col md={6} className="mb-4">
                          <Form.Group controlId="madeby">
                            <Form.Label>Made By</Form.Label>
                            <Form.Select
                              value={selectedOptions?.madeby || ""}
                              onChange={(e) =>
                                setSelectedOptions({
                                  ...selectedOptions,
                                  madeby: e.target.value,
                                })
                              }
                            >
                              <option value="">Made By</option>
                              {[
                                ...new Set([
                                  ...discharge.map((option) => option.madeby),
                                  ...mades.map((made) => made.name),
                                ]),
                              ].map((madeby, index) => (
                                <option key={index} value={madeby}>
                                  {madeby}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-4">
                          <Form.Group controlId="treatingby">
                            <Form.Label>Treating By</Form.Label>
                            <Form.Select
                              value={selectedOptions?.treatingby || ""}
                              onChange={(e) =>
                                setSelectedOptions({
                                  ...selectedOptions,
                                  treatingby: e.target.value,
                                })
                              }
                            >
                              <option value="">Treating By</option>
                              {[
                                ...new Set([
                                  ...discharge.map(
                                    (option) => option.treatingby
                                  ),
                                  ...treatings.map((treating) => treating.name),
                                ]),
                              ].map((treatingby, index) => (
                                <option key={index} value={treatingby}>
                                  {treatingby}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                  <Col>
                    <Col md={12} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Diagnosis</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="diagnosis"
                          value={formData.diagnosis}
                          onChange={handleInputChange}
                          style={{ borderRadius: "6px" }}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                    <br />
                    <Col md={12} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Local Care</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="local_care"
                          value={formData.local_care || ""}
                          onChange={handleInputChange}
                          style={{ borderRadius: "6px" }}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="assistanceDoctor">
                          <Form.Label>Assistance Doctor</Form.Label>
                          <Form.Select
                            value={selectedOptions?.assistanceDoctor || ""}
                            onChange={(e) =>
                              setSelectedOptions({
                                ...selectedOptions,
                                assistanceDoctor: e.target.value,
                              })
                            }
                          >
                            <option value="">Assistant Doctor</option>
                            {[
                              ...new Set([
                                ...discharge.map(
                                  (option) => option.assistanceDoctor
                                ),
                                ...assistants.map(
                                  (assistant) => assistant.name
                                ),
                              ]),
                            ].map((assistanceDoctor, index) => (
                              <option key={index} value={assistanceDoctor}>
                                {assistanceDoctor}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="surgeonDoctor">
                          <Form.Label>Surgeon Doctor</Form.Label>
                          <Form.Select
                            value={selectedOptions?.surgeonDoctor || ""}
                            onChange={(e) =>
                              setSelectedOptions({
                                ...selectedOptions,
                                surgeonDoctor: e.target.value,
                              })
                            }
                          >
                            <option value="">Surgeon Doctor</option>
                            {[
                              ...new Set([
                                ...discharge.map(
                                  (option) => option.surgeonDoctor
                                ),
                                ...surgeons.map((surgeon) => surgeon.name),
                              ]),
                            ].map((surgeonDoctor, index) => (
                              <option key={index} value={surgeonDoctor}>
                                {surgeonDoctor}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="checkedby">
                          <Form.Label>Checked By</Form.Label>
                          <Form.Select
                            value={selectedOptions?.checkedby || ""}
                            onChange={(e) =>
                              setSelectedOptions({
                                ...selectedOptions,
                                checkedby: e.target.value,
                              })
                            }
                          >
                            <option value="">Checked By</option>
                            {[
                              ...new Set([
                                ...discharge.map((option) => option.checkedby),
                                ...checks.map((check) => check.name),
                              ]),
                            ].map((checkedby, index) => (
                              <option key={index} value={checkedby}>
                                {checkedby}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="surgeryadvice">
                          <Form.Label>Surgery Advice</Form.Label>
                          <Form.Select
                            value={selectedOptions?.surgeryadvice || ""}
                            onChange={(e) =>
                              setSelectedOptions({
                                ...selectedOptions,
                                surgeryadvice: e.target.value,
                              })
                            }
                          >
                            <option value="">Surgery Advice</option>
                            {[
                              ...new Set([
                                ...discharge.map(
                                  (option) => option.surgeryadvice
                                ),
                                ...surgeries.map((surgery) => surgery.name),
                              ]),
                            ].map((surgeryadvice, index) => (
                              <option key={index} value={surgeryadvice}>
                                {surgeryadvice}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <br />
                <br />
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group controlId="treatmentGiven">
                      <Form.Label>Treatment Given:</Form.Label>
                      <Form.Select
                        name="treatmentGiven"
                        value={formData.treatmentGiven || ""}
                        onChange={handleInputChange}
                      >
                        {formData.prescription_type === "Proctology" && (
                          <>
                            <option value="">Select Treatment</option>
                            {injections.map((injection, index) => (
                              <option key={index} value={injection.name}>
                                {injection.name}
                              </option>
                            ))}
                          </>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Times</Form.Label>
                      <Form.Select
                        name="times"
                        value={formData.times}
                        onChange={handleInputChange}
                      >
                        <option value="">Times</option>
                        <option value="Once">Once</option>
                        <option value="Twice">Twice</option>
                        <option value="Three Times">Three Times</option>
                        <option value="Four Times">Four Times</option>
                        <option value="Five Times">Five Times</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Medicine Route</Form.Label>
                      <Form.Select
                        name="medicineRoute"
                        value={formData.medicineRoute || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Medicine Route</option>
                        <option value="IV">IV</option>
                        <option value="IM">IM</option>
                        <option value="ORAL">ORAL</option>
                        <option value="P/R">P/R</option>
                        <option value="P/V">P/V</option>
                        <option value="S/C">S/C</option>
                        <option value="S/L">S/L</option>
                        <option value="OTHER">OTHER</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Table to Display Injections */}
                  <Col md={2} className="d-flex align-items-end">
                    <Button
                      variant="danger"
                      className="fw-bold px-3 py-2 shadow-sm"
                      onClick={addInjectionDetails}
                    >
                      + Add Injection
                    </Button>
                  </Col>

                  {/* Space for separation */}
                  <div className="my-3"></div>
                  <div className="my-3"></div>
                  {/* Display Injections Table */}
                  {Array.isArray(formData.injectionDetails) &&
                    formData.injectionDetails.length > 0 && (
                      <Table
                        striped
                        bordered
                        hover
                        className="text-center shadow-sm"
                      >
                        <thead className="bg-primary text-white">
                          <tr>
                            <th>Medicine Name</th>
                            <th>Days</th>
                            <th>Medicine Route</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.injectionDetails.map((inj, index) => (
                            <tr key={index}>
                              <td className="fw-bold">{inj.treatmentGiven}</td>
                              <td>{inj.timesGiven}</td>
                              <td>{inj.medicineRoute}</td>
                              <td>
                                <Button
                                  variant="danger"
                                  onClick={() => removeDischarge(index)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  <br />
                  <div>
                    <Col>
                      <Button
                        variant="primary"
                        onClick={() => setShowPopup(true)}
                        className="mt-4"
                      >
                        Upload Medicine
                      </Button>
                    </Col>
                    {showPopup && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 1000,
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "5px",
                            maxWidth: "600px",
                            width: "100%",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            position: "relative",
                          }}
                        >
                          <h2>Upload Medicine</h2>
                          <br />
                          <form onSubmit={handleSubmit}>
                            <label>
                              Medicine Name:
                              <input
                                type="text"
                                name="medicine_name"
                                value={formData.medicine_name}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              />
                            </label>

                            <br />
                            <label>
                              Select Gender:
                              <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </label>

                            <br />
                            <label>
                              Medicine Type:
                              <select
                                name="medicineType"
                                value={formData.medicineType}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              >
                                <option value="">Select</option>
                                <option value="tab">TAB</option>
                                <option value="cap">CAP</option>
                                <option value="syp">SYP</option>
                                <option value="spry">SPRY</option>
                                <option value="cream">CREAM</option>
                                <option value="inj">INJ</option>
                                <option value="powder">POWDER</option>
                              </select>
                            </label>

                            <br />
                            <label>
                              Medical Strength:
                              <input
                                type="text"
                                name="medicalStrength"
                                value={formData.medicalStrength}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              />
                            </label>

                            <br />
                            <label>
                              Medicine Unit:
                              <select
                                name="medicineUnit"
                                value={formData.medicineUnit}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              >
                                <option value="">Select</option>
                                <option value="g">g</option>
                                <option value="mg">mg</option>
                                <option value="mcg">mcg</option>
                                <option value="ml">ml</option>
                                <option value="cc">CC</option>
                                <option value="iu">IU</option>
                                <option value="mol">MOL</option>
                              </select>
                            </label>

                            <br />
                            <label>
                              Medicine Route:
                              <select
                                name="medicineRoute"
                                value={formData.medicineRoute}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              >
                                <option value="">Select</option>
                                <option value="oral">Oral</option>
                                <option value="iV">IV</option>
                                <option value="im">IM</option>
                                <option value="sc">SC</option>
                                <option value="local application">
                                  LOCAL APPICATION
                                </option>
                              </select>
                            </label>

                            <br />
                            <label>
                              Medicine Status:
                              <select
                                name="medicineStatus"
                                value={formData.medicineStatus}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              >
                                <option value="">Select</option>
                                <option value="proctology">Proctology</option>
                                <option value="urology">urology</option>
                              </select>
                            </label>

                            <br />
                            <Button
                              variant="primary"
                              onClick={handleSaveMedicine}
                            >
                              Save
                            </Button>

                            <button
                              onClick={() => setShowPopup(false)}
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                            >
                              X
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </Row>
                <br />
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group controlId="adviceMedicine">
                      <Form.Label>Treatment On Discharge:</Form.Label>
                      <Form.Select
                        name="adviceMedicine"
                        value={formData.adviceMedicine || ""}
                        onChange={handleInputChange}
                      >
                        {formData.prescription_type === "Proctology" && (
                          <>
                            <option value="">Select Medicine</option>
                            {adviceMedicineP.map((adviceMedicineP, index) => (
                              <option key={index} value={adviceMedicineP.name}>
                                {adviceMedicineP.name}
                              </option>
                            ))}
                          </>
                        )}
                        {formData.prescription_type === "Urology" && (
                          <>
                            <option value="">Select Treatment</option>
                            {adviceMedicineU.map((adviceMedicineU, index) => (
                              <option key={index} value={adviceMedicineU.name}>
                                {adviceMedicineU.name}
                              </option>
                            ))}
                          </>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={1}>
                    <Form.Group>
                      <Form.Label>Quantity:</Form.Label>
                      <Form.Select
                        name="medicine_quantity"
                        value={formData.medicine_quantity}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>
                          Qty
                        </option>
                        {Array.from({ length: 60 }, (_, i) => i + 1).map(
                          (num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Time Slot:</Form.Label>
                      <div>
                        {formData.timings &&
                          typeof formData.timings === "object" &&
                          Object.keys(formData.timings).map((timing) => (
                            <Form.Check
                              key={timing}
                              inline
                              type="checkbox"
                              label={timing.replace(/([A-Z])/g, " $1").trim()}
                              name={timing}
                              checked={formData.timings?.[timing] || false}
                              onChange={(e) =>
                                handleCheckboxChange(e, "timings")
                              }
                            />
                          ))}
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={1}>
                    <Form.Group>
                      <Form.Label>Days:</Form.Label>
                      <Form.Select
                        name="medicine_days"
                        value={formData.medicine_days}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>
                          Days
                        </option>
                        {[1, 2, 3, 5, 7, 10, 15, 30, 45, 60, 90, 120].map(
                          (num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Button
                  variant="primary"
                  onClick={addDischargeTreatDetails}
                  className="mt-4"
                >
                  Add to Table
                </Button>
                <br />
                <br />
                {/* Space for separation */}
                <div className="my-3"></div>
                <div className="my-3"></div>
                {/* Display Injections Table */}
                {Array.isArray(formData.dischargeTreat) &&
                  formData.dischargeTreat.length > 0 && (
                    <Table
                      striped
                      bordered
                      hover
                      className="text-center shadow-sm"
                    >
                      <tbody>
                        {formData.dischargeTreat.length > 0 && (
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Medicine Name</th>
                                <th>Quantity</th>
                                <th>Time Slot</th>
                                <th>Days</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.dischargeTreat.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.adviceMedicine}</td>
                                  <td>{item.medicine_quantity}</td>
                                  <td>{item.mealTimings}</td>
                                  <td>{item.medicine_days}</td>
                                  <td>
                                    <Button
                                      variant="danger"
                                      onClick={() => removeDischarge(index)}
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </tbody>
                    </Table>
                  )}
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={handleSubmit}
                >
                  Save Discharge Card
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
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
