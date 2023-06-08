function urlValue(parameterName) {
  const urlSearchParams = new URLSearchParams(location.search);
  return urlSearchParams.get(parameterName);
}

// 예시: movieID 파라미터 값을 추출하여 출력
const movieID = urlValue('movieID');
console.log(movieID);

// API가져오기
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MjI1YTQ1OGUyOWYwZmM3MmY3M2NmOWI2N2Q0Y2RhZSIsInN1YiI6IjY0NzQ3OTM2Y2MyNzdjMDBhNzQ1ZTkzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.s7NxkvQgNu-c9D-N1Zs4Ae3m1qnf4ipY3X3zQd4XseA'
  }
};
// fetch에 가져오는 url 값
const urls = `https://api.themoviedb.org/3/movie/${movieID}?language=en-US`;
console.log(urls);

// img와 title, 추가설명
fetch(urls, options)
  .then(response => response.json())
  .then(response => {
    console.log(response);
    const mains = document.querySelector('.mains');
    console.log(mains);
    mains.innerHTML = '';
    let temps_html = `
        <div class="movies-card">
        <img src="https://image.tmdb.org/t/p/w500/${response.backdrop_path}">
        <h3 class="font-main">${response.title}</h3>
        <p class="info-overview">${response.overview}</p>
        </div>
    `;
    mains.insertAdjacentHTML('beforeend', temps_html);
  })
  .catch(err => console.error(err));

// 예고편 가져오기
const preview = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MjI1YTQ1OGUyOWYwZmM3MmY3M2NmOWI2N2Q0Y2RhZSIsInN1YiI6IjY0NzQ3OTM2Y2MyNzdjMDBhNzQ1ZTkzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.s7NxkvQgNu-c9D-N1Zs4Ae3m1qnf4ipY3X3zQd4XseA'
  }
};
const urls2 = `https://api.themoviedb.org/3/movie/${movieID}/videos?language=en-US`;
fetch(urls2, preview)
  .then(responsed => responsed.json())
  .then(responsed => {
    let example = responsed['results'];
    console.log(responsed);
    console.log(example);

    const trailer = document.querySelector('.trailer');
    trailer.innerHTML = '';

    //동영상들 설정
    example.slice(0, 4).forEach(abc => {
      let temphtml = `
    <div class=movie_trailer>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${abc.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    </div>`;
      trailer.insertAdjacentHTML('beforeend', temphtml);
    });
  })
  .catch(err => console.error(err));
