import BilliardTableForm from "@/app/conponent/billiardTable/Form";

const CreateBilliardTable = () => {
    const table = {
        status: 0,
        tableNumber: 1,
        type: null,
        hourlyRate: 0,
    };
  
    return (<BilliardTableForm table={table}/>)
   
  };
  
  export default CreateBilliardTable;