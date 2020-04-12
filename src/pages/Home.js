
import {Grid, GridColumn, Transition}from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks'
import PostCard from '../component/PostCard';
import React,{ useContext } from 'react';
import { AuthContext } from '../context/auth';
import PostForm from '../component/PostForm'
import {FETCH_POST_QUERY} from '../util/graphql'


function Home() {
    const{user}=useContext(AuthContext)
   var {loading, data:{getPosts:posts}}=useQuery(FETCH_POST_QUERY)

    return  (
      
    <Grid columns={3} >
        <Grid.Row className="page-title">
            <h1>Les derniéres publication</h1>
        </Grid.Row>
    <Grid.Row>
        {user &&(
            <GridColumn>
                <PostForm/>
            </GridColumn>
        )

        }
    {loading ? (
          <h1>Loading Posts..</h1>
      ):(<Transition.Group>

{posts && posts.map(post=>(
          <Grid.Column key={post.id} style={{marginBottom:20}} >
            <PostCard post={post}/>
            </Grid.Column>

          ))}

      </Transition.Group>
         
      ) 
      
          }
      </Grid.Row>
      </Grid> 
    )
}

export default Home
