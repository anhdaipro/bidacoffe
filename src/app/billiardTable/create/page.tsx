import Form from "@/app/conponent/billiardTable/Form";

const CreateBilliardTable = () => {
    const table = {
        status: 0,
        tableNumber: 1,
        type: 0,
        hourlyRate: 0,
    };
  
    return (<Form table={table}/>)
   
  };
  
  export default CreateBilliardTable;