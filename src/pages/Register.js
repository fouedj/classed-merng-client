import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';

function Register(props) {
const context=useContext(AuthContext)    
const [errors,setErrors]=useState({});
const InitialState={
    username:'',
    email:'',
    password:'',
    confirmPassword:''
}

const {onchange,onsubmit,values}=useForm(registerUser,InitialState)



const [addUser,{loading}]=useMutation(REGISTER_USER,{
    update(_,{data:{register:userData}}){
        //console.log(result)
        context.login(userData)
        props.history.push('/');
    }, 
    onError(err){
      //  console.log(err.graphQLErrors[0].extensions.exception.errors)
        setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables:values
})

function registerUser(){
    addUser();
}


    return (
        <div className="form-container">
      <Form onSubmit={onsubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Inscription</h1>

        <Form.Input
        label="Userame"
        type="text"
        placeholder="Entrer votre Username"
        name="username"
        error={errors.username ? true : false}
        value={values.username}
        onChange={onchange}/>


        <Form.Input
        label="Email"
        placeholder="Entrer votre email"
        type="email"
        name="email"
        error={errors.email ? true : false}
        value={values.email}
        onChange={onchange}/>

<Form.Input
        type="password"
        label="Mot de passe"
        placeholder="Entrer votre mot de passe"
        name="password"
        error={errors.password ? true : false}
        value={values.password}
        onChange={onchange}/>

<Form.Input
        type="password"
        label="Confirmation de mot de passe"
        placeholder="Confirmer votre mot de passe"
        name="confirmPassword"
        error={errors.confirmPassword ? true : false}
        value={values.confirmPassword}
        onChange={onchange}/>
        <Button type="submit" primary>
            S'inscrire
        </Button>
      

      </Form>
        {Object.keys(errors).length>0 &&       
        <div className="ui error message">
        <ul className="list">
        {Object.values(errors).map(value=>(
            <li key={value} >{value} </li>
        ))}

        </ul>

      </div>}

        </div>
    )
}
const REGISTER_USER =gql`
mutation register(
    $username:String!
    $email:String!
    $password:String!
    $confirmPassword:String!
){
    register(registerInput:{
        username:$username
        email:$email
        password:$password
        confirmPassword:$confirmPassword
    }){
        id username email token createdAt
    }
}


`

export default Register
