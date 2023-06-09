const inputNick = document.querySelector('#nick-input');
const inputComment = document.querySelector('#comment-input');
const rootDiv = document.querySelector('#comments');
const btn = document.querySelector('#submit');
const mainCommentCount = document.querySelector('#count'); //댓글 숫자
const movieID = urlValue('movieID');

function urlValue(parameterName) {
  const urlSearchParams = new URLSearchParams(location.search);
  return urlSearchParams.get(parameterName);
}

function showContents(nick, comment) {
  //생성
  const userName = document.createElement('div');
  const commentValue = document.createElement('span');
  const showTime = document.createElement('div');
  const countSpan = document.createElement('span');
  const commentList = document.createElement('div'); //스코프 밖으로 나가는 순간 하나지우면 다 지워지고 입력하면 리스트 다불러옴.
  const delBtn = document.createElement('button');

  //생성 속성 부여
  userName.className = 'name';
  commentValue.className = 'commentValue';
  showTime.className = 'time';
  commentList.className = 'eachComment';
  delBtn.className = 'deleteComment';
  delBtn.innerHTML = '삭제';

  //태그 위치 조립 (뿌려주기)
  countSpan.innerHTML = 0;
  commentList.append(userName, commentValue, showTime, delBtn);
  showTime.innerHTML = generateTime();
  rootDiv.prepend(commentList);

  //입력값 넘기기
  userName.innerText = nick;
  commentValue.innerText = comment;

  delBtn.addEventListener('click', deleteContent);
  // delBtn.addEventListener('click', delString);
}

//타임스템프
function generateTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const wDate = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  const time = year + '-' + month + '-' + wDate + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

function deleteContent(event) {
  const btn = event.target;
  const list = btn.parentNode; //commentList
  rootDiv.removeChild(list);
  //메인댓글 카운트 줄이기.
  if (parseInt(mainCommentCount.innerHTML) <= '0') {
    mainCommentCount.innerHTML = 0;
  } else {
    mainCommentCount.innerHTML--;
  }
}

//버튼 > 입력값 전달
function pressBtn() {
  const nickVal = inputNick.value;
  const commentVal = inputComment.value;

  if (!commentVal.length || !nickVal.length) {
    alert('빈칸을 입력해주세요!!');
  } else {
    showContents(nickVal, commentVal);
    mainCommentCount.innerHTML++;
    inputNick.value = '';
    inputComment.value = '';
    //버튼> 로컬스토리지에 전달
    let savedData = localStorage.getItem('commentData');
    if (savedData) {
      savedData = JSON.parse(savedData);
    } else {
      savedData = [];
    }

    // 새로운 데이터 저장
    const newData = {
      nick: nickVal,
      comment: commentVal,
      movie_ID: movieID
    };
    savedData.push(newData);

    // 로컬 스토리지에 데이터 저장
    localStorage.setItem('commentData', JSON.stringify(savedData));
  }
}
// 로컬 스토리지에 데어터 삭제
function delString(event) {
  const btn = event.target;
  const list = btn.parentNode;
  const nick = list.querySelector('.name').innerText;
  const comment = list.querySelector('.commentValue').innerText;

  let savedData = localStorage.getItem('commentData');
  savedData = JSON.parse(savedData);
  let filterData = savedData.filter(data => {
    return data.nick === nick && data.comment === comment;
  });
  localStorage.removeItem('commentData', filterData);
  localStorage.getItem('commentData', filterData);
}

// 페이지 로드 시 저장된 데이터 불러오기
// 원래 값
// document.addEventListener('DOMContentLoaded', function () {
//   let savedData = localStorage.getItem('commentData');
//   if (savedData) {
//     savedData = JSON.parse(savedData);
//     savedData.forEach(function (data) {
//       showContents(data.nick, data.comment);
//       mainCommentCount.innerHTML++;
//     });
//   }
// });

// 필터링 해서 페이지에 저장된 데이터를 불러오기
document.addEventListener('DOMContentLoaded', function () {
  let savedData = localStorage.getItem('commentData');
  savedData = JSON.parse(savedData);
  let filterData = savedData.filter(data => {
    return data.movie_ID === movieID;
  });
  filterData.forEach(data => {
    showContents(data.nick, data.comment);
    mainCommentCount.innerHTML++;
  });
});

btn.onclick = pressBtn;
