import { useState } from "react"


export const useForm=(callback,initialState={})=>{
    const[values,setValues]=useState(initialState)
    
    const onchange=(e)=>{
        setValues({...values,[e.target.name]:e.target.value})
        //console.log(values)
        }
        const onsubmit=(e)=>{
            e.preventDefault();
            callback();

        }
        return{
            onchange,
            onsubmit,
            values
        }
}