import React from "react";
import BirthdayAlert from "./compoents/BirthdayAlert";
import DailyOpdReport from "./compoents/DailyOpdReport/DailyOpdReport";
import AppointmentReport from "./compoents/AppointmentReport/AppointmentReport";
import ReceptionistReport from "./compoents/ReceptionistReport/ReceptionistReport";
import OPDCollection from  "./compoents/OPDcollection/OPDCollection";
import IPDCollection from "./compoents/IPDCollection/IPDCollection";
import ReferenceReport from "./compoents/ReferenceReport/ReferenceReport";
import ConditionWiseReport from "./compoents/ConditionWiseReport/ConditionWiseReport";
import SxConversionReport from "./compoents/SxConversionReport/SxConversionReport";
import BillingReport from "./compoents/BillingReport/BillingReport";
import IpdDueReport from "./compoents/IpdDueReport/IpdDueReport";
import InsuranceDueReport from "./compoents/InsuranceDueReport/InsuranceDueReport";
import OPDIPDCollectionPage from "./compoents/OPDIPDCollectionPage/OPDIPDCollectionPage";
import PharmacyCollection from "./compoents/PharmacyReport/PharmacyCollectionReport";
import EnquiryConversation from "./compoents/EnquiryConversation/EnquiryConversation";
import EnquiryData from "./compoents/EnquiryData/EnquiryData";


const App = () => {
  return (
    <div>
      <h3>BIRTHDAY ALERT</h3>
             <BirthdayAlert />
             <DailyOpdReport />
             <AppointmentReport/>
             <ReceptionistReport />
             <OPDCollection/>
             <IPDCollection/>
             <ReferenceReport/>
             <ConditionWiseReport/>
             <SxConversionReport/>
             <BillingReport/>
             <IpdDueReport/>
             <InsuranceDueReport/>
             <OPDIPDCollectionPage/>
             <PharmacyCollection/>
             <EnquiryConversation/>
             <EnquiryData/>
            
           
             
    </div>
  );
};

export default App;
