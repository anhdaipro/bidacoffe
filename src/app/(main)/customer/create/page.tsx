import Form from "@/component/customer/Form"
const Create = () =>{
    const customer = {
        name:'',
        phone:'',
        status:''
    }
    return (
        <Form customer = {customer}/>
    )
}
export default Create