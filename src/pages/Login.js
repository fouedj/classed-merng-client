import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'

function Login(props) {
const {login} =useContext(AuthContext)    
const [errors,setErrors]=useState({})
const {onchange,onsubmit,values}= useForm(loginUsercallback,{
    username:'',
    password:''

})

const [loginUser,{loading}]=useMutation(LOGIN_USER,{
    update(_,{data:{login:userData}}){
        console.log(userData)
        login(userData)
        props.history.push('/');
    },
    onError(err){
      //  console.log(err.graphQLErrors[0].extensions.exception.errors)
        setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables:values
})
function loginUsercallback(){
    console.log (values)
    loginUser()
}


    return (
        <div className="form-container">
      <Form onSubmit={onsubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Authentification</h1>

        <Form.Input
        label="Userame"
        type="text"
        placeholder="Entrer votre Username"
        name="username"
        error={errors.username ? true : false}
        value={values.username}
        onChange={onchange}/>


     

<Form.Input
        type="password"
        label="Mot de passe"
        placeholder="Entrer votre mot de passe"
        name="password"
        error={errors.password ? true : false}
        value={values.password}
        onChange={onchange}/>


        <Button type="submit" primary>
            Connecter
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
const LOGIN_USER =gql`
mutation login($username:String!   $password:String!){
    login(username:$username
        password:$password){
         id 
         username 
         email 
         token 
         createdAt
    }
}


`

export default Login
