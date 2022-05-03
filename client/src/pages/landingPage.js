import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BsChevronDoubleDown } from "react-icons/bs";
import { BtnComponent as Btn } from '../components/BtnComponent';

import image1 from '../img/landing1.png'
import image2 from '../img/landing2.png'
import image3 from '../img/landing3.png'

const Container = styled.section`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 1200px;
  /* width: 100vw; */
  height: max-content;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const Top = styled.div`
  position: absolute;
  top: -100px;
  left: 0;

  display: grid;
  place-items: center;

  width: 100%;

  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 60%, rgba(255,255,255,1) 100%),
              url(https://images.unsplash.com/photo-1531012804729-7df44b58327b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1710&q=80); 
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  .wrapper {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    width: 100vw;
    max-width: 2000px;
    height: max-content;

    .intro {
      grid-column: 2 / 12;
      /* position: absolute; */
      left: 0;
      top: 0;

      display: grid;
      width: 100%;
      padding: 70px;

      box-sizing: border-box;

      font-size: 1.8rem;

      height: max-content;
      
      p {
        margin-top: 20px;
        margin-bottom: 20px;

        &:first-child{
          margin-top: 0;
        }
      } 
    } 
  }

  .start {
    margin-top: 50px;

    width: max-content;

    font-size: 1.2rem;
    padding-bottom: 5px;
    border-bottom: 1px solid;

    cursor: pointer;
  }

  .scroll_down {
    position: relative;
    bottom : -150px;
    display: flex;
    align-items: center;
    flex-direction: column;

    color : #888;

    width: 100%;

    /* font-size: 1.2rem; */

    p {
      margin-bottom: 10px;
    }

    svg {
      animation : bounce 1.2s linear infinite;

      @keyframes bounce {
        0%{
          transform: translateY(0);
        }

        50% {
          transform: translateY(10px);
        }

        100% {
          transform: translateY(0);
        }
      }
    }
  }

  @media screen and (max-width : 500px){
    min-height: 300px;
    height: max-content;

    .wrapper {
      position: relative;
      display: block;
      width: 100vw;
      height: 100%;

      .intro {
        position: absolute;
        top: 0;
        grid-column: 0 / -1;
        font-size: 1rem;
        height: 150px;
        padding: 20px;

      p {
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }
  }

    .start {
      position: absolute;
      top: 17px;
      right: 17px;

      margin-top: 0;

      font-size: 1rem;
    }

    .scroll_down {
      bottom : -120px;
    }
  }

`

const InnerContainer = styled.div`
  position: relative;
  grid-column: 2 / 12;

  width: 100%;
  height: max-content;

  margin-top: 700px;
  
  section {
    position: relative;
    display: flex;
    align-items: center;

    height: 400px;
    width: 100%;

    margin-bottom: 300px;

    .image {
      opacity: 0;
      display: grid;
      place-items: center;

      width: 50%;
      height: 400px;

      transform: translateX(-30px);

      img {
        height: 400px;
      }

      transition : 1s;
    }

    .text {
      opacity: 0;
      position: absolute;
      right : 0;
      display: flex;

      flex-direction: column;
      justify-content: center;
      align-items: flex-end;

      width: 700px;
      height: 400px;

      transform: translateX(30px);

      .wrapper {
        display : flex;
      }

      p {
        font-size: 2rem;
        margin-bottom: 20px;
      }
      transition : 1s 0.5s;
    }
  }

  section.appear {
    .image{
      opacity : 1;
      transform: translateX(0);
    }

    .text {
      opacity : 1;
      transform: translateX(0);
    }
  }

  @media screen and (max-width : 500px){
    width: 100%;
    margin-top: 250px;

    section {
      display : grid;
      place-items: center;
      height: max-content;

      margin-top: 30px;
      margin-bottom : 100px;

      .image {
        display: flex;
        justify-content: center;
        height: 200px;

        z-index: -1;
        img {
          width: 300px;
          height: auto;
        }
      }

      .text {
        position: static;
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 100%;
        height: 100px;

        .wrapper {
          display : flex;
        }

        p {
        font-size: 1.1rem;
        }   
      }
    }
  }
`

const Logo = styled.div`
  font-family: "Sriracha", cursive;
  color: #000;
  font-size: 4rem;
  cursor: pointer;
  span {
    color: #e80707;
  }

  @media screen and (max-width : 500px){
    font-size: 3rem;
  }
`

const SmallLogo = styled(Logo)`
  position: relative;
  top: -10px;
  margin-bottom: 10px;
  font-size: 3rem;

  @media screen and (max-width : 500px){
    position: relative;
    top: -10px;
    font-size: 2rem;
  }
`

const BtnContainer = styled.div`
  width: 100%;
  display : flex;
  justify-content: center;

  margin-top: 150px;

  @media screen and (max-width : 500px){
    margin-top: 50px;
  }
`

export const LandingPage = () => {
  const image_1 = useRef()
  const image_2 = useRef()
  const image_3 = useRef()

  // 교차감시 -> 해당 요소 보여지면 상태 true 로, 
  // 혹은 클래스 추가 ref, addClass
  // 각 요소에 애니메이션 추가
  // forward
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear')
          io.unobserve(entry.target)
        }
      })
    }, {
      threshold: 1
    })

    io.observe(image_1.current)
    io.observe(image_2.current)
    io.observe(image_3.current)
    // return () => {
    //   io.disconnect()
    // }
  }, [])


  const navigate = useNavigate()

  return (
    <Container>
      <Top>
        <div className="wrapper">
          <div className="intro">
            <p>같은 장소, 다른 시선</p>
            <p>나의 감정과 시선을 공유하는 서비스</p>
            <Logo>PIC<span>.</span></Logo>
            <p>입니다.</p>
            <div className='start' onClick={() => navigate('/my_pics')}>시작하기 &gt;&gt;</div>
          </div>
        </div>
        <div className='scroll_down'>
          <p>scroll</p>
          <BsChevronDoubleDown size="1.5rem" />
        </div>
      </Top>
      <InnerContainer>
        <section className='first' ref={image_1}>
          <div className="image">
            <img src={image1} alt="1" />
          </div>
          <div className="text">
            <p>사진에 담긴 그때의 감정을</p>
            <p>남들과 공유하고 싶으셨던 적이 있으셨나요?</p>
          </div>
        </section>
        <section className='second' ref={image_2}>
          <div className="image">
            <img src={image2} alt="2" />
          </div>
          <div className="text">
            <p>반복되는 일상, 늘 지나던 같은 장소가</p>
            <p>왠지 달라보이던 순간들이 있으셨나요?</p>
          </div>
        </section>
        <section className='third' ref={image_3}>
          <div className="image">
            <img src={image3} alt="3" />
          </div>
          <div className="text">
            <div className="wrapper">
              <SmallLogo>PIC<span>.</span></SmallLogo>
              <p>을 통해 사람들과</p>
            </div>
            <p>당신의 특별한 순간을 공유해보세요.</p>
          </div>
        </section>
        <BtnContainer>
          <Btn width={'90%'} action={() => navigate('/my_pics')}>시작하기</Btn>
        </BtnContainer>
      </InnerContainer>
    </Container>
  );
};