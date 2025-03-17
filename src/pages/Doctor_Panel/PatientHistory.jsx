import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Container,
  Tab,
  Tabs,
} from "react-bootstrap";
import NavBarD from "./NavbarD";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "http://192.168.29.127:5000/api";

const SurgeryTabs = ({
  selectedOptions,
  setSelectedOptions,
  isDisabled,
  formData,
  setFormData,
}) => {
  const [key, setKey] = useState("piles");

  // Ensure formData and surgeryTabs exist
  if (!formData || !formData.surgeryTabs) {
    return null; // Or a loading state
  }

  const tabData = [
    {
      id: "piles",
      title: "Piles",
      checkboxes: [
        "PR Bleeding: Painless",
        "PR Bleeding: Painful",
        "Burning",
        "Pricking",
        "Itching",
        "Incomplete Evacuation",
        "Prolapse",
        "Swelling",
        "Pain at Anal Region",
        "Mucus Mixed Blood",
      ],
      textarea: "piles_duration",
    },
    {
      id: "fistula",
      title: "Fistula",
      checkboxes: [
        "Pus Discharge",
        "Boil",
        "Watery Discharge",
        "Swelling near anal region",
        "Discharge from vagina gases/ stool",
      ],
      textarea: "fistula_duration",
    },
    {
      id: "hernia",
      title: "Hernia",
      checkboxes: [
        "Swelling: Umbilical",
        "Right Inguinal",
        "Left Inguinal",
        "Swelling: Abdominal",
        "Reducible",
        "Nonreducible",
        "Past Sx",
      ],
      textarea: "hernia_duration",
    },
    {
      id: "varicose",
      title: "Varicose",
      checkboxes: ["Varicose Veins"],
      textarea: "varicose_duration",
    },
    {
      id: "uninary",
      title: "Uninary",
      checkboxes: ["Uninary Incontinence"],
      textarea: "Urinary_incontinence_duration",
    },
    {
      id: "fecal",
      title: "Fecal",
      checkboxes: ["Fecal Incontinence"],
      textarea: "Fecal_incontinence_duration",
    },
    {
      id: "urology",
      title: "Urology",
      checkboxes: [
        "Pain",
        "Burning urination",
        "Nausea",
        "Vomiting",
        "LUTS",
        "Urgency of urination",
        "Incomplete evacuation",
        "Stream of urine",
        "Nocturia",
      ],
    },
    {
      id: "ods",
      title: "ODS",
      checkboxes: [
        "Excessive Straining",
        "Digitation",
        "Hard Stools",
        "Enema/laxative",
        "Fragmented Defecation",
      ],
      textareas: [
        { name: "ods_duration", placeholder: "Duration" },
        { name: "bowel_habits", placeholder: "Bowel Habits" },
      ],
    },
    {
      id: "pilonidal",
      title: "Pilonidal Sinus",
      checkboxes: [], // No checkboxes for this tab
      textarea: "pilonidalsinus",
    },
    {
      id: "circumcision",
      title: "Circumcision",
      checkboxes: [], // No checkboxes for this tab
      textarea: "circumcision",
    },
  ];

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedOptions((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      surgeryTabs: {
        ...prevState.surgeryTabs,
        [name]: value,
      },
    }));
  };

  return (
    <Tabs
      activeKey={key}
      onSelect={(k) => setKey(k)}
      style={{ borderBottom: "2px solid #e0f7fa" }}
    >
      {tabData.map((tab) => (
        <Tab
          eventKey={tab.id}
          title={tab.title}
          key={tab.id}
          style={{ padding: "15px" }}
        >
          <Row>
            {tab.checkboxes.map((item, index) => (
              <Col md={4} key={index} style={{ marginBottom: "10px" }}>
                <Form.Check
                  type="checkbox"
                  id={`${tab.id}-${index}`}
                  label={item}
                  value={item}
                  checked={
                    Array.isArray(selectedOptions) &&
                    selectedOptions.includes(item)
                  } // Ensure selectedOptions is an array
                  onChange={handleCheckboxChange}
                  disabled={isDisabled}
                />
              </Col>
            ))}
          </Row>

          {tab.textarea && (
            <Row style={{ marginTop: "20px" }}>
              <Col md={6}>
                <Form.Control
                  as="textarea"
                  name={tab.textarea}
                  placeholder="Duration"
                  value={formData.surgeryTabs[tab.textarea] || ""}
                  onChange={handleInputChange}
                  disabled={isDisabled}
                  style={{
                    width: "100%",
                    minHeight: "80px",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ced4da",
                  }}
                />
              </Col>
            </Row>
          )}

          {tab.textareas && Array.isArray(tab.textareas) && (
            <Row style={{ marginTop: "20px" }}>
              {tab.textareas.map((textarea, index) => (
                <Col md={6} key={index}>
                  <Form.Control
                    as="textarea"
                    name={textarea.name}
                    placeholder={textarea.placeholder}
                    value={formData.surgeryTabs[textarea.name] || ""}
                    onChange={handleInputChange}
                    disabled={isDisabled}
                    style={{
                      width: "100%",
                      minHeight: "80px",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ced4da",
                    }}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Tab>
      ))}
    </Tabs>
  );
};

export default function PatientHistory() {
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    patient_date: "",
    height: "",
    weight: "",
    painscale: "",
    vitalSigns: {
      BP: "",
      Pulse: "",
      RR: "",
    },
    systematicExamination: {
      RS: "",
      CVS: "",
      CNS: "",
      PA: "",
    },
    general_history: {
      hoWtLoss: false,
      decAppetite: false,
      hoStrainingForurination: false,
      acidity: false,
      gas: false,
      bloating: false,
      other: "",
    },
    family_history: {
      piles: false,
      constipation: false,
      dm: false,
      htn: false,
      heartDisease: false,
      other: "",
    },
    past_history: {
      dm: false,
      htn: false,
      brAsthma: false,
      thyroid: false,
      otherDetails: "",
    },
    habits: {
      smoking: false,
      alcohol: false,
      tobacco: false,
      drugs: false,
    },
    drugs_allery: "",
    comment: "",
    presentcomplaints: "",
    complaints: "",
    ongoing_medicines: {
      clopidogrel: false,
      aspirin: false,
      warfarin: false,
      other: "",
    },
    otherongoingmedi: "",
    investigation: {
      hb: false,
      bslr: false,
      bleedingTimeBt: false,
      clottingTimeBt: false,
      ptInr: false,
      hiv: false,
      hbsag: false,
      srCreatinine: false,
      vitB: false,
      other: "",
    },
    knowncaseof: "",
    medical_mx: {
      mrd: false,
      manoBf: false,
      coloGastro: false,
      mcdpa: false,
      diet: false,
      b: false,
      d: false,
    },
    medications: [],

    surgeryTabs: {
      piles_duration: "",
      fistula_duration: "",
      hernia_duration: "",
      varicose_duration: "",
      uninary_duration: "",
      fecal_duration: "",
      urology_duration: "",
      ods_duration: "",
      bowel_habits: "",
      pilonidalsinus: "",
      circumcision: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [patientHistory, setPatientHistory] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [assistantsDoctor, setAssistantsDoctor] = useState([]);
  const [showEditButton, setShowEditButton] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [disablePreviousButton, setDisablePreviousButton] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected checkboxes

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
          `${BASE_URL}/V1/patientHistory/listPatientHistory/${patientId}`,
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

        if (data?.data?.patientHistory?.length > 0) {
          const patientData = data.data.patientHistory[0];

          // Initialize medicationData to avoid undefined reference
          let medicationData = [];
          if (data?.data?.medicationHistory?.length > 0) {
            medicationData = data.data.medicationHistory;
          }
          setMedicationHistory(medicationData);

          setFormData((prevState) => ({
            ...prevState,
            ...patientData,
            vitalSigns: {
              ...prevState.vitalSigns,
              ...(patientData.vitalSigns || {}),
            },
            systematicExamination: {
              ...prevState.systematicExamination,
              ...(patientData.systematicExamination || {}),
            },
            general_history: {
              ...prevState.general_history,
              hoWtLoss: patientData.general_history?.hoWtLoss || false,
              decAppetite: patientData.general_history?.decAppetite || false,
              hoStrainingForurination:
                patientData.general_history?.hoStrainingForurination || false,
              acidity: patientData.general_history?.acidity || false,
              gas: patientData.general_history?.gas || false,
              bloating: patientData.general_history?.bloating || false,
              other: patientData.general_history?.other || "",
            },
            family_history: {
              ...prevState.family_history,
              piles: patientData.family_history?.piles || false,
              constipation: patientData.family_history?.constipation || false,
              dm: patientData.family_history?.dm || false,
              htn: patientData.family_history?.htn || false,
              heartDisease: patientData.family_history?.heartDisease || false,
              other: patientData.family_history?.other || "",
            },
            past_history: {
              ...prevState.past_history,
              dm: patientData.past_history?.dm || false,
              htn: patientData.past_history?.htn || false,
              brAsthma: patientData.past_history?.brAsthma || false,
              thyroid: patientData.past_history?.thyroid || false,
              otherDetails: patientData.past_history?.otherDetails || "",
            },
            habits: {
              ...prevState.habits,
              smoking: patientData.habits?.smoking || false,
              alcohol: patientData.habits?.alcohol || false,
              tobacco: patientData.habits?.tobacco || false,
              drugs: patientData.habits?.drugs || false,
            },
            ongoing_medicines: {
              ...prevState.ongoing_medicines,
              clopidogrel: patientData.ongoing_medicines?.clopidogrel || false,
              aspirin: patientData.ongoing_medicines?.aspirin || false,
              warfarin: patientData.ongoing_medicines?.warfarin || false,
              other: patientData.ongoing_medicines?.other || "",
            },
            investigation: {
              ...prevState.investigation,
              hb: patientData.investigation?.hb || false,
              bslr: patientData.investigation?.bslr || false,
              bleedingTimeBt:
                patientData.investigation?.bleedingTimeBt || false,
              clottingTimeBt:
                patientData.investigation?.clottingTimeBt || false,
              ptInr: patientData.investigation?.ptInr || false,
              hiv: patientData.investigation?.hiv || false,
              hbsag: patientData.investigation?.hbsag || false,
              srCreatinine: patientData.investigation?.srCreatinine || false,
              vitB: patientData.investigation?.vitB || false,
              other: patientData.investigation?.other || "",
            },
            medical_mx: {
              ...prevState.medical_mx,
              mrd: patientData.medical_mx?.mrd || false,
              manoBf: patientData.medical_mx?.manoBf || false,
              coloGastro: patientData.medical_mx?.coloGastro || false,
              mcdpa: patientData.medical_mx?.mcdpa || false,
              diet: patientData.medical_mx?.diet || false,
              b: patientData.medical_mx?.b || false,
              d: patientData.medical_mx?.d || false,
            },
            knowncaseof: {
              ...prevState.knowncaseof,
              ...(patientData.knowncaseof || {}),
            },
            medications:
              medicationData.length > 0
                ? medicationData
                : prevState.medications,
          }));
        } else {
          console.warn("No patient data found in API response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
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
  }, [patientId]);

  const validate = () => {
    const validationErrors = {};
    if (!formData.patient_date)
      validationErrors.patient_date = "Patient date is required";
    if (!formData.height) validationErrors.height = "Height is required";
    if (!formData.weight) validationErrors.weight = "Weight is required";
    return validationErrors;
  };

  const handleInputChange = (e, id, field) => {
    const { name, value, type, checked } = e.target;

    // if (name === "family_history") {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     family_history: {
    //       ...prevState.family_history,
    //       other: value,
    //     },
    //   }));
    // } else {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     [name]: type === "checkbox" ? checked : value,
    //   }));
    // }
    if (id && field) {
      const updatedMedications = formData.medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      );
      setFormData({ ...formData, medications: updatedMedications });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [category, field] = name.split(".");
    const [parent, child] = name.split(".");

    // if (name === "family_history") {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     family_history: {
    //       ...prevState.family_history,
    //       [child]: checked,
    //     },
    //   }));
    // } else
    if (child) {
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: checked },
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: checked,
        },
      }));
    }
  };

  const handleSubmit = async () => {
    const patientId = localStorage.getItem("selectedPatientId");

    try {
      console.log("Form data before saving:", formData);
      const pastHistoryArray = [];
      if (formData.past_history.dm) pastHistoryArray.push("DM");
      if (formData.past_history.htn) pastHistoryArray.push("HTN");
      if (formData.past_history.brAsthma) pastHistoryArray.push("Br.Asthma");
      if (formData.past_history.thyroid) pastHistoryArray.push("Thyroid");
      if (formData.past_history.otherDetails)
        pastHistoryArray.push(formData.past_history.otherDetails);

      const familyHistoryArray = [];
      if (formData.family_history.piles) familyHistoryArray.push("Piles");
      if (formData.family_history.constipation)
        familyHistoryArray.push("Constipation");
      if (formData.family_history.dm) familyHistoryArray.push("DM");
      if (formData.family_history.htn) familyHistoryArray.push("HTN");
      if (formData.family_history.heartDisease)
        familyHistoryArray.push("Heart Disease");
      if (formData.family_history.other)
        familyHistoryArray.push(formData.family_history.other);

      const ongoingMedcineArray = [];
      if (formData.ongoing_medicines.clopidogrel)
        ongoingMedcineArray.push("Clopidogrel");
      if (formData.ongoing_medicines.aspirin)
        ongoingMedcineArray.push("Aspirin");
      if (formData.ongoing_medicines.warfarin)
        ongoingMedcineArray.push("Warfarin");
      if (formData.ongoing_medicines.other)
        ongoingMedcineArray.push(formData.ongoing_medicines.other);

      const investigationArray = [];
      if (formData.investigation.hb) investigationArray.push("HB");
      if (formData.investigation.bslr) investigationArray.push("BSL-R");
      if (formData.investigation.bleedingTimeBt) investigationArray.push("BT");
      if (formData.investigation.clottingTimeBt) investigationArray.push("CT");
      if (formData.investigation.ptInr) investigationArray.push("PT INR");
      if (formData.investigation.hiv) investigationArray.push("HIV");
      if (formData.investigation.hbsag) investigationArray.push("Hbsag");
      if (formData.investigation.srCreatinine)
        investigationArray.push("SR.Creatinine");
      if (formData.investigation.vitB) investigationArray.push("Vit B12");
      if (formData.investigation.other)
        investigationArray.push(formData.investigation.other);

      const adviceArray = [];
      if (formData.medical_mx.mrd) adviceArray.push("MRD");
      if (formData.medical_mx.manoBf) adviceArray.push("Mano/BF");
      if (formData.medical_mx.coloGastro) adviceArray.push("Colo/Gastro");
      if (formData.medical_mx.mcdpa) adviceArray.push("MCDPA");
      if (formData.medical_mx.diet) adviceArray.push("Diet");
      if (formData.medical_mx.b) adviceArray.push("B12");
      if (formData.medical_mx.d) adviceArray.push("D3");

      const habitsArray = [];
      if (formData.habits.smoking) habitsArray.push("Smoking");
      if (formData.habits.alcohol) habitsArray.push("Alcohol");
      if (formData.habits.tobacco) habitsArray.push("Tobacco");
      if (formData.habits.drugs) habitsArray.push("Drugs");

      const generalArray = [];
      if (formData.general_history.hoWtLoss) generalArray.push("H/O Wt Loss");
      if (formData.general_history.decAppetite)
        generalArray.push("Dec Appetite");
      if (formData.general_history.hoStrainingForurination)
        generalArray.push("H/O Straining for urination");
      if (formData.general_history.acidity) generalArray.push("Acidity");
      if (formData.general_history.gas) generalArray.push("Gas");
      if (formData.general_history.bloating) generalArray.push("Bloating");
      if (formData.general_history.other)
        generalArray.push(formData.general_history.other);

      const formattedData = {
        ...formData,
        general_history: generalArray.join(","),
        habits: habitsArray.join(","),
        ongoing_medicines: ongoingMedcineArray.join(","), // Join the array into a string
        investigation: investigationArray.join(","),
        BP: formData.vitalSigns.BP,
        Pulse: formData.vitalSigns.Pulse,
        RR: formData.vitalSigns.RR,
        RS: formData.systematicExamination.RS,
        CVS: formData.systematicExamination.CVS,
        CNS: formData.systematicExamination.CNS,
        PA: formData.systematicExamination.PA,
        past_history: pastHistoryArray.join(","), // Join the array into a string

        family_history: familyHistoryArray.join(","), // Join the array into a string
        medical_mx: adviceArray.join(","),
        name: selectedOptions.name,
        patientId,
      };

      const saveResponse = await fetch(
        `${BASE_URL}/V1/patientHistory/addPatientHistory/${patientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.message || "Failed to save patient history");
      }

      const historyResponse = await fetch(
        `${BASE_URL}/V1/patientHistory/updateHistoryChk/${patientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ historychk: 3 }),
        }
      );

      if (!historyResponse.ok) {
        throw new Error("Failed to update history check");
      }

      alert("Patient history saved successfully!");
    } catch (error) {
      console.error("Error saving patient history:", error);
      alert("Failed to save patient history. Please try again.");
    }
  };

const handleUpdate = async () => {
  if (!patientId) {
    alert("No patient selected!");
    return;
  }

  try {
     const pastHistoryArray = [];
     if (formData.past_history.dm) pastHistoryArray.push("DM");
     if (formData.past_history.htn) pastHistoryArray.push("HTN");
     if (formData.past_history.brAsthma) pastHistoryArray.push("Br.Asthma");
     if (formData.past_history.thyroid) pastHistoryArray.push("Thyroid");
     if (formData.past_history.otherDetails)
       pastHistoryArray.push(formData.past_history.otherDetails);

     const familyHistoryArray = [];
     if (formData.family_history.piles) familyHistoryArray.push("Piles");
     if (formData.family_history.constipation)
       familyHistoryArray.push("Constipation");
     if (formData.family_history.dm) familyHistoryArray.push("DM");
     if (formData.family_history.htn) familyHistoryArray.push("HTN");
     if (formData.family_history.heartDisease)
       familyHistoryArray.push("Heart Disease");
     if (formData.family_history.other)
       familyHistoryArray.push(formData.family_history.other);

     const ongoingMedcineArray = [];
     if (formData.ongoing_medicines.clopidogrel)
       ongoingMedcineArray.push("Clopidogrel");
     if (formData.ongoing_medicines.aspirin)
       ongoingMedcineArray.push("Aspirin");
     if (formData.ongoing_medicines.warfarin)
       ongoingMedcineArray.push("Warfarin");
     if (formData.ongoing_medicines.other)
       ongoingMedcineArray.push(formData.ongoing_medicines.other);

     const investigationArray = [];
     if (formData.investigation.hb) investigationArray.push("HB");
     if (formData.investigation.bslr) investigationArray.push("BSL-R");
     if (formData.investigation.bleedingTimeBt) investigationArray.push("BT");
     if (formData.investigation.clottingTimeBt) investigationArray.push("CT");
     if (formData.investigation.ptInr) investigationArray.push("PT INR");
     if (formData.investigation.hiv) investigationArray.push("HIV");
     if (formData.investigation.hbsag) investigationArray.push("Hbsag");
     if (formData.investigation.srCreatinine)
       investigationArray.push("SR.Creatinine");
     if (formData.investigation.vitB) investigationArray.push("Vit B12");
     if (formData.investigation.other)
       investigationArray.push(formData.investigation.other);

     const adviceArray = [];
     if (formData.medical_mx.mrd) adviceArray.push("MRD");
     if (formData.medical_mx.manoBf) adviceArray.push("Mano/BF");
     if (formData.medical_mx.coloGastro) adviceArray.push("Colo/Gastro");
     if (formData.medical_mx.mcdpa) adviceArray.push("MCDPA");
     if (formData.medical_mx.diet) adviceArray.push("Diet");
     if (formData.medical_mx.b) adviceArray.push("B12");
     if (formData.medical_mx.d) adviceArray.push("D3");

     const habitsArray = [];
     if (formData.habits.smoking) habitsArray.push("Smoking");
     if (formData.habits.alcohol) habitsArray.push("Alcohol");
     if (formData.habits.tobacco) habitsArray.push("Tobacco");
     if (formData.habits.drugs) habitsArray.push("Drugs");

     const generalArray = [];
     if (formData.general_history.hoWtLoss) generalArray.push("H/O Wt Loss");
     if (formData.general_history.decAppetite)
       generalArray.push("Dec Appetite");
     if (formData.general_history.hoStrainingForurination)
       generalArray.push("H/O Straining for urination");
     if (formData.general_history.acidity) generalArray.push("Acidity");
     if (formData.general_history.gas) generalArray.push("Gas");
     if (formData.general_history.bloating) generalArray.push("Bloating");
     if (formData.general_history.other)
       generalArray.push(formData.general_history.other);

     const updatedData = {
       ...formData,
       general_history: generalArray.join(","),
       habits: habitsArray.join(","),
       ongoing_medicines: ongoingMedcineArray.join(","), // Join the array into a string
       investigation: investigationArray.join(","),
       BP: formData.vitalSigns.BP,
       Pulse: formData.vitalSigns.Pulse,
       RR: formData.vitalSigns.RR,
       RS: formData.systematicExamination.RS,
       CVS: formData.systematicExamination.CVS,
       CNS: formData.systematicExamination.CNS,
       PA: formData.systematicExamination.PA,
       past_history: pastHistoryArray.join(","), // Join the array into a string

       family_history: familyHistoryArray.join(","), // Join the array into a string
       medical_mx: adviceArray.join(","),
       name: selectedOptions.name,
       patientId,
       surgical_history: formData.comment,
     };

    console.log("Updating patient history with:", updatedData);

    const response = await fetch(
      `${BASE_URL}/V1/patientHistory/updatePatientHistory/${patientId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update patient history");
    }
    const data = await response.json();
    console.log("Response data:", data);
    if (data.statusCode === 200) {
      alert("Patient history updated successfully!");
      setIsDisabled(true);
      setShowEditButton(true);
      setPreviousRecordDate(formData.date_diagnosis);
      setDisablePreviousButton(true);
    } else {
      throw new Error(data.message || "Failed to update surgery details");
    }
  } catch (error) {
    console.error("Error updating patient history:", error);
    alert("Failed to update patient history. Please try again.");
  }
};


  const [previousRecordDate, setPreviousRecordDate] = useState("");
  const [assistantDoctorName, setAssistantDoctorName] = useState("");

  const fetchPreviousRecords = async (prevData) => {
    try {
      console.log("Fetching previous records for patientId:", patientId);

      const response = await fetch(
        `${BASE_URL}/V1/patientHistory/listPatientHistory/${patientId}`
      );

      const result = await response.json();
      console.log("on click Fetched Data:", result.data.patientHistory);
      console.log(
        "on click fetched medication Data:",
        result.data.medicationHistory
      );

      if (!response.ok) {
        throw new Error("Failed to fetch previous records");
      }

      const patientHistory = result.data.patientHistory;
      setAssistantDoctorName(result.data.doctor.name);

      const medicationHistory = result.data.medicationHistory;

      setPreviousRecordDate(
        patientHistory.date_patientHistory || prevData.date_patientHistory || ""
      );
      // const symptomsArray = patientHistory.symptoms;
      const pastHistoryString = patientHistory.past_history || "";
      const knownConditions = ["DM", "HTN", "Br.Asthma", "Thyroid"];
      const pastHistoryArray = pastHistoryString
        .split(",")
        .map((item) => item.trim());

      const generalString = patientHistory.general_history || "";
      // const GknownConditions = [
      //   "H/O Wt Loss",
      //   "Dec Appetite",
      //   "H/O Straining for urination",
      //   "Acidity",
      //   "Gas",
      //   "Bloating",
      // ];
      const generalArray = generalString.split(",").map((item) => item.trim());

      const AdviceString = patientHistory.medical_mx || "";
      const AdviceArray = AdviceString.split(",").map((item) => item.trim());

      const familyHistoryString = patientHistory.family_history || "";
      const FknownConditions = [
        "Piles",
        "Constipation",
        "DM",
        "HTN",
        "Heart Disease",
      ];
      const familyHistoryArray = familyHistoryString
        .split(",")
        .map((item) => item.trim());

      const ongoingMedicineString = patientHistory.ongoing_medicines || "";
      const MknownConditions = ["Clopidogrel", "Aspirin", "Warfarin"];
      const ongoingMedicineArray = ongoingMedicineString
        .split(",")
        .map((item) => item.trim());

      const investigationString = patientHistory.investigation || "";
      const IknownConditions = [
        "HB",
        "BSL-R",
        "BT",
        "CT",
        "PT INR",
        "HIV",
        "Hbsag",
        "SR.Creatinine",
        "Vit B12",
      ];
      const investigationArray = investigationString
        .split(",")
        .map((item) => item.trim());

      const habitsString = patientHistory.habits || "";
      const habitsArray = habitsString.split(",").map((item) => item.trim());

      const formattedMedications =
        medicationHistory.length > 0
          ? medicationHistory.map((med, index) => ({
              id: index + 1,
              medicine: med.medicine || "",
              indication: med.indication || "",
              since: med.since || "",
            }))
          : [
              { id: 1, medicine: "", indication: "", since: "" },
              { id: 2, medicine: "", indication: "", since: "" },
            ];

      setFormData((prevData) => ({
        ...prevData,
        patient_date: patientHistory.patient_date || "",
        height: patientHistory.height || "",
        weight: patientHistory.weight || "",
        painscale: patientHistory.painscale || "",
        vitalSigns: {
          ...prevData.vitalSigns,
          BP: patientHistory.BP || "",
          Pulse: patientHistory.Pulse || "",
          RR: patientHistory.RR || "",
        },
        systematicExamination: {
          ...prevData.systematicExamination,
          RS: patientHistory.RS || "",
          CVS: patientHistory.CVS || "",
          CNS: patientHistory.CNS || "",
          PA: patientHistory.PA || "",
        },
        general_history: {
          hoWtLoss: generalArray.includes("H/O Wt Loss"),
          decAppetite: generalArray.includes("Dec Appetite"),
          hoStrainingForurination: generalArray.includes(
            "H/O Straining for urination"
          ),
          acidity: generalArray.includes("Acidity"),
          gas: generalArray.includes("Gas"),
          bloating: generalArray.includes("Bloating"),
        },
        // symptoms: {
        //   ...prevData.symptoms,
        //   pusDischarge: symptomsArray.includes("Pus Discharge"),
        //   boil: symptomsArray.includes("Boil"),
        //   wateryDischarge: symptomsArray.includes("Watery Discharge"),
        //   swellingAnalRegion: symptomsArray.includes(
        //     "Swelling near anal region"
        //   ),
        // },
        family_history: {
          piles: familyHistoryArray.includes("Piles"),
          constipation: familyHistoryArray.includes("Constipation"),
          dm: familyHistoryArray.includes("DM"),
          htn: familyHistoryArray.includes("HTN"),
          heartDisease: familyHistoryArray.includes("Heart Disease"),
          other: familyHistoryArray
            .filter((condition) => !FknownConditions.includes(condition))
            .join(", "), // Set otherDetails
        },
        past_history: {
          dm: pastHistoryArray.includes("DM"),
          htn: pastHistoryArray.includes("HTN"),
          brAsthma: pastHistoryArray.includes("Br.Asthma"),
          thyroid: pastHistoryArray.includes("Thyroid"),
          otherDetails: pastHistoryArray
            .filter((condition) => !knownConditions.includes(condition))
            .join(", "), // Set otherDetails
        },
        habits: {
          smoking: habitsArray.includes("Smoking"),
          alcohol: habitsArray.includes("Alcohol"),
          tobacco: habitsArray.includes("Tobacco"),
          drugs: habitsArray.includes("Drugs"),
        },
        surgeryTabs: {
          ...prevData.surgeryTabs,
          piles_duration: patientHistory.piles_duration || "",
          fistula_duration: patientHistory.fistula_duration || "",
          ods_duration: patientHistory.ods_duration || "",
          hernia_duration: patientHistory.hernia_duration || "",
          varicose_duration: patientHistory.varicose_duration || "",
        },
        piles: patientHistory.piles || [],
        fistula: patientHistory.fistula || [],
        hernia: patientHistory.hernia || [],
        varicose: patientHistory.varicose || [],
        uninary: patientHistory.uninary || [],
        fecal: patientHistory.fecal || [],
        urology: patientHistory.urology || [],
        ods: patientHistory.ods || [],
        pilonidal: patientHistory.pilonidal || "",
        circumcision: patientHistory.circumcision || "",
        drugs_allery: patientHistory.drugs_allery || "",
        comment: patientHistory.comment || "",
        presentcomplaints: patientHistory.presentcomplaints || "",
        complaints: patientHistory.complaints || "",
        ongoing_medicines: {
          clopidogrel: ongoingMedicineArray.includes("Clopidogrel"),
          aspirin: ongoingMedicineArray.includes("Aspirin"),
          warfarin: ongoingMedicineArray.includes("Warfarin"),
          other: ongoingMedicineArray
            .filter((condition) => !MknownConditions.includes(condition))
            .join(", "), // Set otherDetails
        },
        investigation: {
          hb: investigationArray?.includes("HB"),
          bslr: investigationArray?.includes("BSL-R"),
          bleedingTimeBt: investigationArray?.includes("BT"),
          clottingTimeBt: investigationArray?.includes("CT"),
          ptInr: investigationArray?.includes("PT INR"),
          hiv: investigationArray?.includes("HIV"),
          hbsag: investigationArray?.includes("Hbsag"),
          srCreatinine: investigationArray?.includes("Sr.Creatinine"),
          vitB: investigationArray?.includes("Vit B12"),
          other: investigationArray
            .filter((condition) => !IknownConditions.includes(condition))
            .join(", "),
        },
        knowncaseof: patientHistory.knowncaseof || "",
        medical_mx: {
          mrd: AdviceArray.includes("MRD"),
          manoBf: AdviceArray.includes("Mano/BF"),
          coloGastro: AdviceArray.includes("Colo/Gastro"),
          mcdpa: AdviceArray.includes("MCDPA"),
          diet: AdviceArray.includes("Diet"),
          b: AdviceArray.includes("B12"),
          d: AdviceArray.includes("D3"),
        },
        medications: formattedMedications, // ✅ Set medications properly
      }));

      setSelectedOptions(patientHistory.selectedOptions || []);
      setShowEditButton(true);
      setDisablePreviousButton(true);
      setIsDisabled(true);

      console.log("Form data updated with previous records");
    } catch (error) {
      console.error("Error fetching previous records:", error);
      alert("Failed to fetch previous records.");
    }
  };

  const handleEditPatientHistory = () => {
    setIsDisabled(false);

    alert("Editing mode enabled. You can now modify the diagnosis details.");
  };

  const handleNewRecord = () => {
    const newData = {
      patient_date: new Date().toISOString().split("T")[0],
      height: "",
      weight: "",
      painscale: "",
      vitalSigns: { BP: "", Pulse: "", RR: "" },
      systematicExamination: { RS: "", CVS: "", CNS: "", PA: "" },
      general_history: {
        hoWtLoss: "",
        decAppetite: "",
        hoStrainingForurination: "",
        acidity: "",
        gas: "",
        bloating: "",
      },
      family_history: {
        piles: "",
        constipation: "",
        dm: "",
        htn: "",
        heartDisease: "",
      },
      past_history: { dm: "", htn: "", brAsthma: "", thyroid: "" },
      habits: { smoking: "", alcohol: "", tobacco: "", drugs: "" },
      piles: [],
      fistula: [],
      hernia: [],
      varicose: [],
      uninary: [],
      fecal: [],
      urology: [],
      ods: [],
      pilonidal: "",
      circumcision: "",
      drugs_allery: "",
      comment: "",
      presentcomplaints: "",
      complaints: "",
      ongoing_medicines: {
        Clopidogrel: "",
        aspirin: "",
        warfarin: "",
      },
      otherongoingmedi: "",
      investigation: {
        hb: "",
        bslr: "",
        bleedingTimeBt: "",
        clottingTimeBt: "",
        ptInr: "",
        hiv: "",
        hbsag: "",
        srCreatinine: "",
        vitB: "",
      },
      knowncaseof: "",
      advice: {
        mrd: "",
        manoBf: "",
        coloGastro: "",
        mcdpa: "",
        diet: "",
        b: "",
        d: "",
      },
      medications: [],
      surgeryTabs: {
        piles_duration: "",
        fistula_duration: "",
        hernia_duration: "",
        varicose_duration: "",
        uninary_duration: "",
        fecal_duration: "",
        urology_duration: "",
        ods_duration: "",
        bowel_habits: "",
        pilonidal_sinus: "",
      },
    };

    console.log("New Form Data:", newData);
    setFormData(newData);
    setSelectedOptions([]);
    setShowEditButton(false);

    setDisablePreviousButton(false);
    setIsDisabled(false);

    alert("New Record: You can now enter new data.");
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
      <NavBarD pagename="Patient History" />

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
                      style={{
                        float: "right",
                      }}
                      onClick={fetchPreviousRecords}
                      disabled={disablePreviousButton}
                    >
                      Previous Records
                    </button>
                    {showEditButton && (
                      <button
                        type="button"
                        className="btn btn-warning"
                        style={{ float: "right", marginRight: "7px" }}
                        onClick={handleEditPatientHistory}
                      >
                        Edit Diagnosis
                      </button>
                    )}
                  </div>
                  {previousRecordDate && (
                    <div style={{ marginTop: "15px" }}>
                      <strong>Previous Record Date: </strong>
                      <span>{previousRecordDate}</span>
                    </div>
                  )}
                  <br />
                  <Row>
                    <Col md={2} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Patient Date:</Form.Label>
                        <DatePicker
                          selected={
                            formData?.patient_date
                              ? new Date(formData.patient_date)
                              : null
                          }
                          onChange={(date) => {
                            handleInputChange({
                              target: {
                                name: "patient_date",
                                value: date
                                  ? date.toISOString().split("T")[0]
                                  : "",
                              },
                            });
                          }}
                          isInvalid={!!errors.patientDate}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Select Patient Date"
                          maxDate={new Date()}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.patientDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={2} className="mb-4">
                      <Form.Group>
                        <Form.Label>Height:</Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                height: e.target.value,
                              })
                            }
                            isInvalid={!!errors.height}
                            placeholder="Enter height"
                          />
                          <span className="ms-2 align-self-center">FEET</span>
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.height}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={2} className="mb-4">
                      <Form.Group>
                        <Form.Label>Weight:</Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                weight: e.target.value,
                              })
                            }
                            isInvalid={!!errors.weight}
                            placeholder="Enter weight"
                          />
                          <span className="ms-2 align-self-center">kgs</span>
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.weight}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <SurgeryTabs
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    isDisabled={isDisabled}
                    formData={formData}
                    setFormData={setFormData}
                  />
                  <Row>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Pain Score:</Form.Label>
                        <Form.Select
                          as="select"
                          name="painscale"
                          value={formData.painscale}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            Select Pain Score
                          </option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md={6}>
                      <Form.Label>Vital Signs:</Form.Label>
                      <Row>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>BP:</Form.Label>
                            <div className="d-flex align-items-center">
                              <Form.Control
                                type="text"
                                name="vitalSigns.BP"
                                value={formData.vitalSigns.BP}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  setFormData((prev) => ({
                                    ...prev,
                                    vitalSigns: {
                                      ...prev.vitalSigns,
                                      BP: value,
                                    },
                                  }));
                                }}
                              />
                              <span className="ms-2">mm of hg</span>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Pulse:</Form.Label>
                            <div className="d-flex align-items-center">
                              <Form.Control
                                type="text"
                                name="vitalSigns.Pulse"
                                value={formData.vitalSigns.Pulse}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  setFormData((prev) => ({
                                    ...prev,
                                    vitalSigns: {
                                      ...prev.vitalSigns,
                                      Pulse: value,
                                    },
                                  }));
                                }}
                              />
                              <span className="ms-2">/Min</span>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>RR:</Form.Label>
                            <div className="d-flex align-items">
                              <Form.Control
                                type="text"
                                name="vitalSigns.RR"
                                value={formData.vitalSigns.RR}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /\D/g,
                                    ""
                                  );
                                  setFormData((prev) => ({
                                    ...prev,
                                    vitalSigns: {
                                      ...prev.vitalSigns,
                                      RR: value,
                                    },
                                  }));
                                }}
                              />
                              <span className="ms-2">/Min</span>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Form.Label>Systematic Examination:</Form.Label>
                      <Row>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>RS:</Form.Label>
                            <div className="d-flex align-items-center">
                              <Form.Control
                                type="text"
                                name="systematicExamination.RS"
                                value={formData.systematicExamination.RS}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    systematicExamination: {
                                      ...prev.systematicExamination,
                                      RS: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>CVS:</Form.Label>
                            <Form.Control
                              type="text"
                              name="systematicExamination.CVS"
                              value={formData.systematicExamination.CVS}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  systematicExamination: {
                                    ...prev.systematicExamination,
                                    CVS: e.target.value,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>CNS:</Form.Label>
                            <Form.Control
                              type="text"
                              name="systematicExamination.CNS"
                              value={formData.systematicExamination.CNS}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  systematicExamination: {
                                    ...prev.systematicExamination,
                                    CNS: e.target.value,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>P/A:</Form.Label>
                            <Form.Control
                              type="text"
                              name="systematicExamination.PA"
                              value={formData.systematicExamination.PA}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  systematicExamination: {
                                    ...prev.systematicExamination,
                                    PA: e.target.value,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {/* Row 5: Family History */}
                  <Row className="mb-3">
                    <Form.Label>Family History:</Form.Label>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="family_history.piles"
                            checked={formData.family_history.piles || false}
                            onChange={handleCheckboxChange}
                            id="family_history_piles"
                            style={{ marginRight: "5px" }}
                          />
                          Piles
                        </label>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="family_history.constipation"
                            checked={
                              formData.family_history.constipation || false
                            }
                            onChange={handleCheckboxChange}
                            id="family_history_constipation"
                            style={{ marginRight: "5px" }}
                          />
                          Constipation
                        </label>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="family_history.dm"
                            checked={formData.family_history.dm || false}
                            onChange={handleCheckboxChange}
                            id="family_history_dm"
                            style={{ marginRight: "5px" }}
                          />
                          DM
                        </label>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="family_history.htn"
                            checked={formData.family_history.htn || false}
                            onChange={handleCheckboxChange}
                            id="family_history_htn"
                            style={{ marginRight: "5px" }}
                          />
                          HTN
                        </label>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="family_history.heartDisease"
                            checked={
                              formData.family_history.heartDisease || false
                            }
                            onChange={handleCheckboxChange}
                            id="family_history_heartDisease"
                            style={{ marginRight: "5px" }}
                          />
                          Heart Disease
                        </label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        as="textarea"
                        placeholder="Any Other"
                        name="family_history.other"
                        value={formData.family_history.other || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            family_history: {
                              ...prev.family_history,
                              other: e.target.value,
                            },
                          }))
                        }
                        style={{ minHeight: "80px" }}
                      />
                    </Col>
                  </Row>
                  <br />
                  {/* Row 6: General History */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>General History:</Form.Label>
                        <div className="d-flex flex-wrap">
                          {[
                            {
                              label: "H/o Wt Loss",
                              name: "general_history.hoWtLoss",
                            },
                            {
                              label: "Dec Appetite",
                              name: "general_history.decAppetite",
                            },
                            {
                              label: "H/O Straining for urination",
                              name: "general_history.hoStrainingForurination",
                            },
                            {
                              label: "Acidity",
                              name: "general_history.acidity",
                            },
                            {
                              label: "Bloating",
                              name: "general_history.bloating",
                            },
                            { label: "Gas", name: "general_history.gas" },
                          ].map(({ label, name }) => (
                            <label
                              key={name}
                              className="d-flex align-items-center me-3"
                            >
                              <Form.Check
                                inline
                                name={name}
                                checked={
                                  formData.general_history?.[
                                    name.split(".")[1]
                                  ] || false
                                }
                                onChange={handleCheckboxChange}
                                id={name}
                                style={{ marginRight: "5px" }}
                              />
                              {label}
                            </label>
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row className="mb-3">
                    <Form.Label>Past Medical History:</Form.Label>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="past_history.dm"
                            checked={formData.past_history.dm || false}
                            onChange={handleCheckboxChange}
                            id="past_history_dm"
                            style={{ marginRight: "5px" }}
                          />
                          DM
                        </label>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="past_history.htn"
                            checked={formData.past_history.htn || false}
                            onChange={handleCheckboxChange}
                            id="past_history_htn"
                            style={{ marginRight: "5px" }}
                          />
                          HTN
                        </label>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="past_history.brAsthma"
                            checked={formData.past_history.brAsthma || false}
                            onChange={handleCheckboxChange}
                            id="past_history_brAsthma"
                            style={{ marginRight: "5px" }}
                          />
                          Br Asthma
                        </label>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="past_history.thyroid"
                            checked={formData.past_history.thyroid || false}
                            onChange={handleCheckboxChange}
                            id="past_history_thyroid"
                            style={{ marginRight: "5px" }}
                          />
                          Thyroid
                        </label>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        as="textarea"
                        placeholder="Any Other Specify"
                        name="past_history.otherDetails"
                        value={formData.past_history.otherDetails || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            past_history: {
                              ...prev.past_history,
                              otherDetails: e.target.value,
                            },
                          }))
                        }
                        style={{ minHeight: "80px" }}
                      />
                    </Col>
                  </Row>
                  <Form.Label>Habits:</Form.Label>
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="habits.smoking"
                            checked={formData.habits.smoking}
                            onChange={handleCheckboxChange}
                            id="habits_smoking"
                            style={{ marginRight: "5px" }}
                          />
                          Smoking
                        </label>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="habits.alcohol"
                            checked={formData.habits.alcohol}
                            onChange={handleCheckboxChange}
                            id="habits_alcohol"
                            style={{ marginRight: "5px" }}
                          />
                          Alcohol
                        </label>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="habits.tobacco"
                            checked={formData.habits.tobacco}
                            onChange={handleCheckboxChange}
                            id="habits_tobacco"
                            style={{ marginRight: "5px" }}
                          />
                          Tobacco
                        </label>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <label className="d-flex align-items-center">
                          <Form.Check
                            inline
                            type="checkbox"
                            name="habits.drugs"
                            checked={formData.habits.drugs}
                            onChange={handleCheckboxChange}
                            id="habits_drugs"
                            style={{ marginRight: "5px" }}
                          />
                          Drugs
                        </label>
                      </Form.Group>
                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <Col md={10}>
                      <Form.Group>
                        <Form.Label>Allergy to Any Drug:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="drugs_allery"
                          value={formData.drugs_allery}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  {/* Row 2: Medications Table */}
                  <Form.Label>Medication Details:</Form.Label>
                  <table border="1" className="mb-3" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Sr No</th>
                        <th>Name</th>
                        <th>Indication</th>
                        <th>Since</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.medications.map((med, index) => (
                        <tr key={med.id}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              value={med.medicine}
                              onChange={(e) =>
                                handleInputChange(e, med.id, "medicine")
                              }
                              placeholder="Enter medication name"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={med.indication}
                              onChange={(e) =>
                                handleInputChange(e, med.id, "indication")
                              }
                              placeholder="Enter indication"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={med.since}
                              onChange={(e) =>
                                handleInputChange(e, med.id, "since")
                              }
                              placeholder="Enter since"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br />
                  <Row>
                    <Col md={4}>
                      {/* Add More Button */}
                      <Button
                        variant="primary"
                        onClick={() => {
                          const newId = formData.medications.length + 1;
                          const newMedication = {
                            id: newId,
                            medicine: "",
                            indication: "",
                            since: "",
                          };
                          setFormData({
                            ...formData,
                            medications: [
                              ...formData.medications,
                              newMedication,
                            ],
                          });
                        }}
                      >
                        Add More
                      </Button>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Past Surgical History:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="comment"
                          value={formData.comment}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Present Complaints:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="presentcomplaints"
                          value={formData.presentcomplaints}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Any Other Complaints:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="complaints"
                          value={formData.complaints}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row className="mb-3">
                    <Col>
                      <Form.Label>Ongoing Medicines:</Form.Label>
                      <Row>
                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="ongoing_medicines.clopidogrel"
                                checked={formData.ongoing_medicines.clopidogrel}
                                onChange={handleCheckboxChange}
                                id="ongoing_medicines_clopidogrel"
                                style={{ marginRight: "5px" }}
                              />
                              Clopidogrel
                            </label>
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="ongoing_medicines.aspirin"
                                checked={formData.ongoing_medicines.aspirin}
                                onChange={handleCheckboxChange}
                                id="ongoing_medicines_aspirin"
                                style={{ marginRight: "5px" }}
                              />
                              Aspirin
                            </label>
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="ongoing_medicines.warfarin"
                                checked={formData.ongoing_medicines.warfarin}
                                onChange={handleCheckboxChange}
                                id="ongoing_medicines_warfarin"
                                style={{ marginRight: "5px" }}
                              />
                              Warfarin
                            </label>
                          </Form.Group>
                        </Col>

                        <Col xs={3}>
                          <Form.Group>
                            <Form.Control
                              as="textarea"
                              placeholder="Any Other"
                              name="ongoing_medicines.other"
                              value={formData.ongoing_medicines.other || ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  ongoing_medicines: {
                                    ...prev.ongoing_medicines,
                                    other: e.target.value,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md={10}>
                      <Form.Label>Previous Investigation:</Form.Label>
                      <Row>
                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="investigation.hb"
                                checked={formData.investigation.hb || false}
                                onChange={handleCheckboxChange}
                                id="investigation_hb"
                                style={{ marginRight: "5px" }}
                              />
                              HB
                            </label>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="investigation.bslr"
                                checked={formData.investigation.bslr || false}
                                onChange={handleCheckboxChange}
                                id="investigation_bslr"
                                style={{ marginRight: "5px" }}
                              />
                              BSL-R
                            </label>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="investigation.bleedingTimeBt"
                                checked={
                                  formData.investigation.bleedingTimeBt || false
                                }
                                onChange={handleCheckboxChange}
                                id="investigation_bleedingTimeBt"
                                style={{ marginRight: "5px" }}
                              />
                              Bleeding Time-BT
                            </label>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="investigation.clottingTimeBt"
                                checked={
                                  formData.investigation.clottingTimeBt || false
                                }
                                onChange={handleCheckboxChange}
                                id="investigation_clottingTimeBt"
                                style={{ marginRight: "5px" }}
                              />
                              Clotting time- CT
                            </label>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="investigation.ptInr"
                                checked={formData.investigation.ptInr || false}
                                onChange={handleCheckboxChange}
                                id="investigation_ptInr"
                                style={{ marginRight: "5px" }}
                              />
                              PT INR
                            </label>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="investigation.hiv"
                                checked={formData.investigation.hiv || false}
                                onChange={handleCheckboxChange}
                                id="investigation_hiv"
                                style={{ marginRight: "5px" }}
                              />
                              HIV
                            </label>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="investigation.hbsag"
                                checked={formData.investigation.hbsag || false}
                                onChange={handleCheckboxChange}
                                id="investigation_hbsag"
                                style={{ marginRight: "5px" }}
                              />
                              Hbsag
                            </label>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="investigation.srCreatinine"
                                checked={
                                  formData.investigation.srCreatinine || false
                                }
                                onChange={handleCheckboxChange}
                                id="investigation_srCreatinine"
                                style={{ marginRight: "5px" }}
                              />
                              SR.Creatinine
                            </label>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <label className="d-flex align-items-center">
                              <Form.Check
                                inline
                                type="checkbox"
                                name="investigation.vitB"
                                checked={formData.investigation.vitB || false}
                                onChange={handleCheckboxChange}
                                id="investigation_vitB"
                                style={{ marginRight: "5px" }}
                              />
                              Vit B12
                            </label>
                          </Form.Group>
                        </Col>

                        {/* Upload File Section */}
                        <Col>
                          <div className="mt-3">
                            <input
                              type="file"
                              id="fileInput"
                              onChange={handleFileChange}
                              className="d-none"
                            />
                            <label
                              htmlFor="fileInput"
                              className="btn btn-primary"
                            >
                              Upload File
                            </label>
                            {selectedFile && (
                              <div className="mt-2 text-primary">
                                <strong>Selected File:</strong>{" "}
                                {selectedFile.name}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Col>

                    <Col md={8}>
                      <Form.Group>
                        <Form.Control
                          as="textarea"
                          name="investigationDetails"
                          placeholder="Investigation Details"
                          value={formData.investigation.other || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              investigation: {
                                ...prev.investigation,
                                other: e.target.value,
                              },
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <Col md={10}>
                      <Form.Group>
                        <Form.Label>Known Case Of:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="knowncaseof"
                          value={formData.knowncaseof}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <br />
                  <Row className="mb-3">
                    <Col>
                      <Form.Label>Advice:</Form.Label>
                      <Row>
                        <div className="d-flex flex-wrap">
                          {[
                            { label: "MRD", name: "medical_mx.mrd" },
                            { label: "Mano/BF", name: "medical_mx.manoBf" },
                            {
                              label: "Colo/Gastro",
                              name: "medical_mx.coloGastro",
                            },
                            { label: "MCDPA", name: "medical_mx.mcdpa" },
                            { label: "Diet", name: "medical_mx.diet" },
                            { label: "B12", name: "medical_mx.b" },
                            { label: "D3", name: "medical_mx.d" },
                          ].map(({ label, name }) => (
                            <Col
                              md={1}
                              key={name}
                              className="d-flex align-items-center"
                            >
                              <Form.Check
                                inline
                                type="checkbox"
                                name={name}
                                checked={
                                  formData.medical_mx?.[name.split(".")[1]] ||
                                  false
                                }
                                onChange={handleCheckboxChange}
                                id={name}
                                style={{ marginRight: "5px" }}
                              />
                              {label}
                            </Col>
                          ))}
                        </div>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <Form.Group controlId="assistantDoctor">
                        <Form.Label>Assistant Doctor:</Form.Label>
                        <Form.Select
                          name="assistantDoctorName"
                          value={
                            selectedOptions?.name || assistantDoctorName || ""
                          }
                          onChange={(e) => {
                            const selectedDoctorName = e.target.value; // Get the selected value
                            setSelectedOptions({
                              ...selectedOptions,
                              name: selectedDoctorName, // Update selected options with the selected doctor's name
                            });
                            setFormData((prev) => ({
                              ...prev,
                              assistanceDoctor: selectedDoctorName, // Update form data with the selected doctor's name
                            }));
                          }}
                        >
                          <option value="">Select Assistant</option>
                          {[
                            ...new Set([
                              // Include the fetched doctor's name
                              assistantDoctorName,
                              ...patientHistory
                                .map((option) => option.assistantDoctorName)
                                .filter(Boolean),
                              ...assistantsDoctor
                                .map((doctor) => doctor.name)
                                .filter(Boolean),
                            ]),
                          ].map((name, index) => (
                            <option key={index} value={name}>
                              {name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Button
                    className="mt-4"
                    onClick={showEditButton ? handleUpdate : handleSubmit}
                    disabled={isDisabled}
                  >
                    {showEditButton ? "Update" : "Save"}
                  </Button>
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

          .checkbox-group {
            margin-bottom: 10px;
          }

          .custom-checkbox {
            border: 3px solid #dee2e6;
            border-radius: 8px;
            padding: 10px 15px;
            margin-bottom: 10px;
            display: block;
            transition: all 0.3s ease;
          }

          .custom-checkbox:hover {
            border-color: #00bcd4;
          }

          .custom-checkbox label {
            font-weight: 600;
            color: #2c3e50;
            margin-left: 8px;
          }

          .details-input {
            margin-top: 8px;
            border: 3px solid #dee2e6;
            border-radius: 8px;
            padding: 8px 12px;
            width: 100%;
            transition: all 0.3s ease;
          }

          .details-input:focus {
            border-color: #00bcd4;
            box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
          }

          .other-details-textarea {
            border: 3px solid #dee2e6;
            border-radius: 8px;
            padding: 12px;
            min-height: 80px;
            width: 100%;
            transition: all 0.3s ease;
          }

          .other-details-textarea:focus {
            border-color: #00bcd4;
            box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
          }

          .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
          }
        `}
      </style>
    </div>
  );
}
