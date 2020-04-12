import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, GridRow, GridColumn, Image, Card, 
    CardContent, CardHeader, CardMeta, CardDescription, Button, Icon, Label, Form} from 'semantic-ui-react';

import moment from 'moment';
import LikeButton from '../component/LikeButton';
import {AuthContext} from '../context/auth'
import DeleteButton from '../component/DeleteButton';
import MyPopup from '../util/MyPopup';

function SinglePost(props) {
    const postId = props.match.params.postId;
         //console.log(props)    
         const commentInputRef=useRef(null)
         console.log(commentInputRef.current)
    const {user}=useContext(AuthContext)
  const [comment,setComment]=useState('')  
 const {data:{getPost}} =useQuery (FETCH_POST_QUERY,{

         variables:{
            postId   
         }
              
    })
    const[createComment]=useMutation(CREATE_COMMENT_MUTATION,{
        update(){
            setComment('')
           commentInputRef.current.blur()        },
        variables:{
            postId,
            body:comment
        }
    })
    function deletePostCallback(){
        props.history.push('/')
    }

    let postMarkup;
    if(!getPost){
        postMarkup=<p>loading ..</p>
    }else{
        const{id,username,createdAt,likes,likeCount,commentCount,body,comments} = getPost;

        postMarkup = (
            <Grid>
                <GridRow >
                <GridColumn width={2}>
                    <Image
                    src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                    size="small"
                    float="right"/>
                </GridColumn>

                <GridColumn width={10}>
               <Card fluid> 
               <CardContent>
               <CardHeader>{username} </CardHeader>  
               <CardMeta > {moment(createdAt).fromNow()}  </CardMeta>
               <CardDescription>{body} </CardDescription>

               </CardContent>
                
                <hr/>
                
                <CardContent extra>
                <LikeButton user={user}  post={{id,likeCount,likes}}  />
                <Button
                 as="div"
                labelPosition="right"
                onClick={()=> console.log("comment on post")}>

                <Button basic color="blue">
                <Icon name="comments"/>
                </Button>
                <Label basic color="blue" pointing="left">
                {commentCount}
                </Label>       
                </Button>
                {user && user.username === username && (
                    <DeleteButton postId={id} callback={deletePostCallback}/>
                )}
                </CardContent>
                
                

               </Card>
                    {user && (
                        <Card fluid>
                           <CardContent>
                           <p>Ajouter votre commentaire ..</p> 
                           <Form>
                               <div className="ui action input fluid">
                                   <input
                                   type="text"
                                   name="comment"
                                   placeholder="inserer votre commentaire"
                                   value={comment}
                                   onChange={event=>setComment(event.target.value)}
                                   ref={commentInputRef}/>
                                    <MyPopup
                                    content="Pour faire un commentaire">
                                     <button type="submit" className="ui button teal"
                                    disabled={comment.trim===''} onClick={createComment}>
                                       Commenter
                                   </button>
                                  </MyPopup>

                                   
                               </div>
                           </Form>
                           </CardContent>

                        </Card>
                    )}
               {comments.map(comment=>(
                   <Card fluid key={comment.id}>
                       <CardContent>
                           {user && user.username===comment.username && (
                               <DeleteButton postId={id} commentId={comment.id}  />
                           )}
                           <CardHeader>
                               {comment.username}
                           </CardHeader>
                           <CardMeta>{moment(comment.createdAt).fromNow(true)} </CardMeta>
                           <CardDescription>
                               {comment.body}
                           </CardDescription>
                       </CardContent>
                   </Card>
               ))}
                </GridColumn>

                </GridRow>

            </Grid>
        )

    }
    return postMarkup
}
const CREATE_COMMENT_MUTATION=gql`

mutation createComment($postId: ID! , $body: String!){
    createComment(postId: $postId , body: $body){
        id
        comments{
            id
            body
            username
            createdAt
        }
        commentCount
    }
}


`
const FETCH_POST_QUERY = gql`
query($postId:ID!){
    getPost(postId: $postId){
        id 
        body 
        username 
        createdAt 
        likeCount 
        likes{
            username
        }
        commentCount
        comments {
            id
            username
             createdAt
              body 
              
        }
    }


}

`;
export default SinglePost;
