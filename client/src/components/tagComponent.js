import { useState } from 'react';
import styled from 'styled-components';
import { BiPlus, BiMinus } from "react-icons/bi";
import { useRef } from 'react';

const Container = styled.div`
  display: flex;

  border-radius: 10px;
  overflow: hidden;

  background-color: ${props => props.usage || props.isSelected ? '#FFEA7C' : '#ddd'};
  // usage props가 존재하지 않고(기본 태그), 선택되지 않은 태그인 경우 회색,
  // 만약 선택된 상태라면 테마색을 표시한다.
  box-shadow: 0px 3px 3px rgba(0,0,0,0.2);

`
const CommonTag = styled.div`
  display: grid;
  place-items: center;
  
  width: max-content;
  min-width: 60px;
  height: 25px;
  
  box-sizing: border-box;
  padding: 3px 10px 0px 10px;

  user-select: none;

  overflow: hidden;

  div{
    min-width: 60px;
    max-width: max-content;
    height: 16px;

    border: none;

    text-align: center;

    cursor: text;

    &:empty:before {
      content: attr(placeholder);
      color: gray;
      /* 해당 태그가 비어있는 경우 가상선택자를 생성한다. */
      /* content 는 placeholder 속성의 속성값을 사용한다. */
      /* 즉, div에 placeholder 속성은 없지만, CSS와 속성의 이름을 이용하여 */
      /* 해당하는 속성명의 속성값을 placeholder '처럼' 사용한다. */
    }

    &:focus{
      outline: none;
      &:empty:before {
        content : '';
      }
    }
  }

  cursor: ${props => !props.usage ? 'pointer' : 'default'};
`

const Btn = styled.div`
  display: ${props => !props.usage ? 'none' : 'grid'};
  place-items: center;
  width: 25px;
  height: 25px;

  box-sizing: border-box;

  background-color: #fff;
  /* border: 1px solid #ddd; */
  border-radius: 10px;

  font-size: 1.3rem;

  cursor: pointer;

  transition: 0.1s;

  &:hover {
    box-shadow: -1px 1px 2px rgba(0,0,0,0.5);

    &:active {
      background-color: ${props => props.usage === 'added' ? '#FF796B' : null};
      background-color: ${props => props.usage === 'add' ? '#ffd600' : null};

      box-shadow: inset -1px 1px 1px rgba(0,0,0,0.2);
    }
  }

`

export const Tag = ({ usage, action, children }) => {
  // usage 은 어떤 버튼인지 결정합니다.
  // 없는 경우 : 일반 태그
  // added : 추가된 태그, 삭제버튼 포함
  // add : 태그 추가를 위한 input, 추가버튼 포함

  // action 은 usage가 add, added 일 때 버튼이 어떤 함수를 실행할 것인지 결정합니다.

  // children 태그 내부의 내용을 결정합니다. children={} 혹은 <Tag>내용</Tag> 으로 전달 할 수 있습니다.

  const [addTagValue, setAddTagValue] = useState('')
  const [isSelected, setIsSelected] = useState(false)

  // 태그 추가를 위한 양식인 경우,
  // 위의 값을 props 을 갱신함수를 이용하여 전달합니다.


  const addTag = useRef()

  const doAction = () => {
    setAddTagValue('')

    if (addTag.current){
      addTag.current.textContent = ''
    }
    if (action) {
      action()
    }
  }

  const selectHandler = () => {
    isSelected ? setIsSelected(false) : setIsSelected(true)
  }

  const KeyHandler = (e) => {
    if (e.keyCode === 32) {
      // space 막기
      e.preventDefault()
    }
    if (e.keyCode === 13) {
      // enter 막기
      e.preventDefault()
      if (action) {
        action()
      }
    }
  }

  return (
    <div>
      <Container usage={usage} isSelected={isSelected}>
        {!usage
          ? <CommonTag onClick={selectHandler} usage={usage}>{children}</CommonTag>
          : null}
        {usage === 'added'
          ? <CommonTag usage={usage}>{children}</CommonTag>
          : null}
        {usage === 'add'
          ? (
            <CommonTag>
              <div
                contentEditable
                spellCheck={false}
                placeholder={children}
                ref={addTag}
                onKeyDown={(e) => KeyHandler(e)}
                onInput={e => setAddTagValue(e.target.innerText)}></div>
            </CommonTag>
          )
          : null}
        <Btn onClick={doAction} usage={usage}>
          {usage === 'added' ? <BiMinus /> : null}
          {usage === 'add' ? <BiPlus /> : null}
        </Btn>
      </Container>
    </div >
  );
};
