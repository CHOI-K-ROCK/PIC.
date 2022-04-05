import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Comment } from "../components/comment"

const Container = styled.section`
margin-top: 10px;

`


const CommentList = styled.section`
  width: calc(101%);
  background-color: #aaa;
  box-shadow: 0px 3px 5px rgba(0,0,0,0.3);
  
  border-radius: 10px;
  .nick {
    font-weight: 550;
    font-size: calc(110%);
    margin-bottom: 10px;
  }
  .option {
    border-radius: 8px;
    background-color: lightcoral;
    color: white;
  }
  .eachComment {
    margin-bottom: 10px;
  }
  `;

const CommentForm = styled.div`
    display: block;
    margin-bottom: 50px;
    
    width: 600px;
    height: 1px;

    background-color: #aaa;
    `

const ListForm = styled.div``

const ModifyBtn = styled.button`
    margin-right: 10px;
    padding: 3px 7px 3px 7px;
    border-radius: 2px;
    border : solid 1px #ababab;
    cursor: pointer;
    background-color: white;
`;

const DeleteBtn = styled.button`
    margin-right: 10px;
    padding: 3px 7px 3px 7px;
    border-radius: 2px;
    border : solid 1px #ababab;
    cursor: pointer;
    background-color: white;
`;


export const CommentContainer = () => {
  const serverPath = process.env.REACT_APP_SERVER_PATH;
  const token = localStorage.getItem("loginToken")
  const { id } = useParams()

  const [input, setInput] = useState("")
  const [comments, setComments] = useState([]);


  const headers = {
    headers: {
      "Authorization": token
    }
  }

  const onChange = (e) => {
    setInput(e.target.value)
  }

  // 댓글 작성및 다시 댓글 목록 불러오기 요청
  const postComment = async () => {
    const res = await axios.post(`${serverPath}/api/posts/${id}/comments`, {
      description: input
    }, headers)
    if (res.status === 201) {
      const response = await axios.get(`${serverPath}/api/posts/${id}/comments`)
      setComments(response.data.comments)
      console.log(comments, "POST")
      setInput("")
    }
  }


  // 댓글 목록 불러오기 요청

  const getComment = async () => {
    const res = await axios.get(`${serverPath}/api/posts/${id}/comments`)
    setComments(res.data.comments)
  }

  useEffect(() => {
    getComment()
  }, [])

  return (
    <Container><div className="category">댓글목록</div>
      <CommentList>
        <div className="comment">
          {comments.map((el, idx) => {
            return <Comment data={el} key={idx}>nick: {el.nickname}  댓글 : {el.description}</Comment>
          })}
        </div>
      </CommentList>
      <CommentForm>
        <h3 className="category">댓글 입력</h3>
        <input value={input} type="text" onChange={onChange} placeholder="댓글금지"></input>
        <button onClick={postComment}>확인</button>
      </CommentForm>
    </Container>
  );
};
