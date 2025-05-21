import CustomerForm from "@/app/conponent/customer/Form"

const Create = () =>{
    const customer = {
        name:'',
        phone:'',
        status:''
    }
    return (
        <CustomerForm customer = {customer}/>
    )
}
export default Create