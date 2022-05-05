import axios from 'axios';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BsPencilSquare, BsGeoAltFill, BsMapFill, BsFillChatDotsFill, BsQuestionLg } from "react-icons/bs";

import { BtnComponent as Btn } from '../components/BtnComponent';
import { LinkTag } from '../components/linkTag';
import { LoadingIndicator } from '../components/loadingIndicator';
import { OneBtnModal } from '../components/oneBtnModal';
import { PageTitle } from '../components/pageTitle';
import { TwoBtnModal } from '../components/twoBtnModal';
import { ToggleLikeBtn } from '../components/toggleLikeBtn';
import { CommentContainer as Comments } from '../components/commentContainer';

import markerImg from "../img/marker.png";

const Container = styled.section`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 1200px;
  height: max-content;

  section{
    margin-bottom: 20px;
  }

  .wrapper {
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .category {
    font-size : 1.5rem;
    margin-bottom: 10px;
  }
`

const InnerContainer = styled.div`
  position: relative;
  grid-column: 2 / 12;
  height: max-content;
`

const TagContainer = styled.section`
  position: relative;

  display: flex;
  flex-wrap: wrap;
  column-gap: 8px;
  row-gap: 10px;
  
  width: 100%;
  min-height: 50px;
  height: max-content;

  .tag_none {
    position: absolute;
    top: calc(50% - 15px);

    width: 160px;

    color: #888;
    text-align: center;
  }
`

const ModifyBtn = styled.div`
  position: absolute;
  right: 0;
  top : -31px;

  display: flex;
  align-items: center;
  
  width: max-content;
  height: 30px;

  transition : 0.1s;

  cursor: pointer;

  font-size: 0.9rem;
  color: #777;

  span {
    position: relative;
    top: 1px;
    margin-right : 6px;
  }

  &:hover {
    transform: translateY(-2px);
    color: #000;
  }

  @media screen and (max-width : 500px) {
    top: -60px;
  }
`

const ImgContainer = styled.section`
  position: relative;

  display: grid;
  place-items: center;

  width: 100%;
  aspect-ratio: 4 / 3;

  box-shadow: 0px 3px 5px rgba(0,0,0,0.3);

  border-radius: 10px;

  overflow: hidden;

  .loading {
    position: absolute;

    display: grid;
    place-items: center;

    width: 100%;
    height: 100%;

    background-color: #fff;
  }

  img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit : contain;
  }

  @media screen and (max-width : 500px) {
    aspect-ratio: 1 / 1;
    img {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit : contain;
    }
  }
`

const LocationLink = styled.div`
  position: absolute;

  right: 20px;
  bottom: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  width: max-content;
  height: 1.5rem;
  padding: 0 6px;

  background-color: #fff;
  border-radius: 1.5rem;
  box-shadow: 0px 2px 3px rgba(0,0,0,0.3);

  color: #666;

  z-index: 2;

  cursor : pointer;

  .wrapper span {  
    position: relative;
    top: 1px;

    font-size: 0.9rem;
  }

  .wrapper svg {
    margin-right: 5px;
  }

  transition: 0.1s;

  &:hover {
    background-color: #ffd600;
    color: #000;
  }
`

const DescContainer = styled.section`
  position: relative;
  width: 100%;
  min-height: 50px;
  max-height: 500px;

  box-sizing: border-box;

  font-family: sans-serif;

  .title_wrapper {
    color: #333;
    
    display: flex;

    margin-top: 30px;
    margin-bottom: 10px;
    
    svg {
      position: relative;
      top: -2px;

      margin-right: 5px;
      color: #333;
    }
  }

  pre {
    min-height : 20px;
    padding: 10px;
    border-left: 3px solid #ffd600;
    border-radius: 3px;
    white-space : pre-wrap;
    line-height: 1.4rem;
  }


`

const MapContainer = styled.section`
  .title_wrapper {
    color: #333;
    
    display: flex;

    margin-top: 30px;
    margin-bottom: 10px;
    
    svg {
      position: relative;
      top: -2px;

      margin-right: 5px;
      color: #333;
    }
  }
`
const KakaoMap = styled.section`
  width: 100%;
  aspect-ratio: 3 / 1;

  box-shadow: 0px 3px 5px rgba(0,0,0,0.3);

  border-radius: 10px;

  @media screen and (max-width : 500px) {
    height: 150px;
  }
`

const CommentContainer = styled.section`
  width: 100%;
  min-height: 300px;
  height: max-content;

    .title_wrapper {
    color: #333;
    
    display: flex;

    margin-top: 30px;
    margin-bottom: 10px;
    
    svg {
      position: relative;
      top: -2px;

      margin-right: 5px;
      color: #333;
    }
  }

    @media screen and (max-width : 500px) {
      .title_wrapper {
        margin-bottom: 0px;
      }
    }
`

const DeleteBtnContainer = styled.div`
  margin-top: 200px;
`

export const PostDetails = () => {
  const kakao = window.kakao

  const serverPath = process.env.REACT_APP_SERVER_PATH;
  const loginToken = window.sessionStorage.getItem('loginToken')
  const userId = window.sessionStorage.getItem('userId')

  const [postData, setPostData] = useState({})
  const [coords, setCoords] = useState([])
  const [tags, setTags] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [likeStat, setLikeStat] = useState(null)
  const [showOnMap, setShowOnMap] = useState(false)

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openDoneModal, setOpenDoneModal] = useState(false)

  const params = useParams()
  const navigate = useNavigate()
  const kakaoMap = useRef()

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${serverPath}/api/posts/${params.id}`)
        const post = res.data.post

        setPostData(post)
        setCoords(post.location)
        setTags(
          [...post.hashtags.keywords, ...post.hashtags.myTags]
            .sort((a, b) => a < b ? - 1 : (a === b) ? 0 : 1)
        )
      } catch (err) {
        //err
      }
    })()
  }, [])

  useEffect(() => {
    if (coords.latitude && coords.longitude) {

      const imageSrc = markerImg, // 마커이미지의 주소입니다    
        imageSize = new kakao.maps.Size(50, 45), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(20, 38) };

      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(coords.latitude, coords.longitude),
        image: markerImage
      })

      const staticMapContainer = kakaoMap.current, // 이미지 지도를 표시할 div  
        staticMapOption = {
          center: new kakao.maps.LatLng(coords.latitude, coords.longitude), // 이미지 지도의 중심좌표
          level: 3, // 이미지 지도의 확대 레벨
        };

      const map = new kakao.maps.Map(staticMapContainer, staticMapOption);
      map.setDraggable(false);
      map.setZoomable(false);

      marker.setMap(map)
    }
  }, [coords])

  const { _id, title, description, photo, nickname, likes } = postData

  useEffect(() => {
    if (likes) {
      setLikeStat(likes.includes(userId))
    }
  }, [postData])

  const openKakaoMap = () => {
    const address = coords.roadAdd ? coords.roadAdd : coords.lotAdd
    window.open(`https://map.kakao.com/link/map/${address},${coords.latitude},${coords.longitude}`);
  }

  // 게시글 삭제
  const deletePost = async () => {
    try {
      const res = await axios.delete(`${serverPath}/api/posts/${params.id}`, {
        headers: {
          Authorization: loginToken
        }
      })
      if (res.status === 200) {
        setOpenDoneModal(true)
      }
    }
    catch (err) {
      // err
    }
  }

  const navigateToModify = () => {
    navigate('modify')
  }

  const modalHandler = (modal) => {
    if (modal === "delete") {
      openDeleteModal ? setOpenDeleteModal(false) : setOpenDeleteModal(true);
    }
    if (modal === "done") {
      openDoneModal ? setOpenDoneModal(false) : setOpenDoneModal(true);
    }
  }

  return (
    <Container>
      {openDeleteModal ? <TwoBtnModal main={'정말로 게시글을 삭제하시겠습니까?'} close={() => modalHandler('delete')} action={deletePost} /> : null}
      {openDoneModal ? <OneBtnModal main={'게시글이 삭제되었습니다.'} close={() => modalHandler('done')} nav={'/my_pics'} /> : null}
      <InnerContainer>
        <PageTitle author={postData.nickname} goBackBtn={true}>{title}</PageTitle>
        {
          postData.author === userId
            ? (<ModifyBtn onClick={navigateToModify}>
              <span>게시글 수정하기</span>
              <BsPencilSquare />
            </ModifyBtn>)
            : null
        }
        <div className='wrapper'>
          <TagContainer>
            {tags.length ? tags.map((tag, idx) => <LinkTag key={idx}>{tag}</LinkTag>) : <p className='tag_none'>설정된 태그가 없습니다.</p>}
          </TagContainer>

          <ToggleLikeBtn likeStat={likeStat} />

        </div>
        <ImgContainer>
          {isLoading && (
            <div className='loading'>
              <LoadingIndicator size={'7rem'} />
            </div>
          )}
          <img src={photo} alt="img" onLoad={() => setIsLoading(false)} />
        </ImgContainer>

        <MapContainer>
          <div className="title_wrapper">
            <BsGeoAltFill />
            <h3>여기서 찍었어요!</h3>
          </div>
          <KakaoMap ref={kakaoMap}>
            <LocationLink onClick={openKakaoMap} onMouseOver={() => setShowOnMap(true)} onMouseLeave={() => setShowOnMap(false)}>
              {showOnMap
                ? (
                  <div className='wrapper'>
                    <BsMapFill />
                    <span>카카오 지도에서 보기</span>
                  </div>
                )
                : (
                  <div className='wrapper'>
                    <BsGeoAltFill />
                    <span>{coords.roadAdd ? coords.roadAdd : coords.lotAdd}</span>
                  </div>
                )
              }
            </LocationLink>
          </KakaoMap>
        </MapContainer>

        {description &&
          (
            <DescContainer>
              <div className="title_wrapper">
                <BsQuestionLg />
                <h3>사진에 대해서</h3>
              </div>
              <pre>{description}</pre>
            </DescContainer>
          )
        }

        <CommentContainer>
          <div className="title_wrapper">
            <BsFillChatDotsFill />
            <h3>재잘재잘</h3>
          </div>
          <Comments />
        </CommentContainer>
        {
          postData.author === userId
            ? (
              <DeleteBtnContainer>
                <Btn width={'100%'} color={'#ddd'} hover={'#FF796B'} action={() => modalHandler('delete')}>게시글 삭제하기</Btn>
              </DeleteBtnContainer>
            )
            : null
        }
      </InnerContainer>
    </Container>
  );
};
