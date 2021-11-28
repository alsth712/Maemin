const modal = document.getElementById("modal")
const myLocationBtn = document.getElementById("myLocationBtn") // 현재 위치 버튼
const locationBtn = document.getElementById("locationBtn")     // 위치 이미지 버튼
const currentAddress = document.querySelector("#myLocation");

let addressArray = []; // 위치 저장 배열 생성
let lngLatArray = [];  // 경도 위도 저장 배열 생성


// = modal 창 =
function modalOn() {
  modal.style.display = "flex"
}
function isModalOn() {
  return modal.style.display === "flex"
}
function modalOff() {
  modal.style.display = "none"
}

myLocationBtn.addEventListener("click", e => {
  modalOn()
})

locationBtn.addEventListener("click", e => {
  modalOn()
})

const closeModal = modal.querySelector(".close-modal")
closeModal.addEventListener("click", e => {
  modalOff()
})
modal.addEventListener("click", e => {
  const evTarget = e.target
  if(evTarget.classList.contains("modal-overlay")) { // modal 바깥부분 클릭 시 modal 닫기
      modalOff()
  }
})
window.addEventListener("keyup", e => { // esc 키 누르면 modal 없어짐
  if(isModalOn() && e.key === "Escape") {
      modalOff()
  }
})



// 주소 값 localStorage에 저장
function saveAddress(){
  localStorage.setItem("address", JSON.stringify(addressArray[0]));
}

// 경도, 위도 값 localStorage에 저장
function saveLngLat(){
  localStorage.setItem("longitude", JSON.stringify(lngLatArray[0])); // 경도
  localStorage.setItem("latitude", JSON.stringify(lngLatArray[1]));  // 위도
}


// = 현재 내 위치 주소 & 지도 보여주기 =
function onGeoOk(position){
  const lat = position.coords.latitude;  // 현재 위도
  const lon = position.coords.longitude; // 현재 경도
  // console.log(`위도 : ${lat} 경도 : ${lon}`);

  var geocoder = new kakao.maps.services.Geocoder();

  var coord = new kakao.maps.LatLng(lat, lon); // 현재 위도,경도 값 넣어주기
  var callback = function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const addressName =  result[0].address.address_name; // 주소값 변수로 설정 
      currentAddress.innerText = addressName;
      document.getElementById("sample5_address").value = addressName; // modal 내부 주소input에 기존 주소값 넣어주기
      
      addressArray.push(addressName); // addressArray 배열에 주소값 넣어주기
      saveAddress(); // localStorage 에 저장

      lngLatArray.push(lon); // lngLatArray 배열에 경도값 넣어주기
      lngLatArray.push(lat); // lngLatArray 배열에 위도값 넣어주기
      saveLngLat();  // localStorage 에 저장

      // === 초기 위치 주소로 지도 표시
      var mapContainer = document.getElementById('map1'), // 지도를 표시할 div 
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
      };  

      // 지도를 생성합니다    
      var map = new kakao.maps.Map(mapContainer, mapOption); 
      
      // 주소-좌표 변환 객체를 생성합니다
      var geocoder = new kakao.maps.services.Geocoder();
      
      // 지도 영역 크기 동적 변경하기
      function resizeMap() {
        var mapContainer = document.getElementById('map');
        // mapContainer.style.width = '300px';
        // mapContainer.style.height = '300px';
        mapContainer.style.marginTop = '10px';

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(addressName, function(result, status) {
    
          // 정상적으로 검색이 완료됐으면 
          if (status === kakao.maps.services.Status.OK) {
      
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
    
            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });
    
            // 인포윈도우로 장소에 대한 설명을 표시합니다
            var infowindow = new kakao.maps.InfoWindow({
                content: '<div style="width:150px;text-align:center;padding:6px 0;color:black;">현재 위치 🚩</div>'
            });
            infowindow.open(map, marker);

            map.relayout();

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
          }// end of if -----
        }); // end of geocoder.addressSearch() -----
      } // end of resizeMap() -----

      // 위치 버튼 클릭 시, 지도 영역 크기 동적 변경하기
      myLocationBtn.addEventListener("click", resizeMap)
      locationBtn.addEventListener("click", resizeMap)

      // console.log('주소값 : ' + result[0].address.address_name + '~!~');
    }// end of if -----
  }; // end of var callback -----

  geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);

} // end of function onGeoOk -----
function onGeoError(){
  alert("위치를 알 수 없음");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);



// = modal 내부 : 주소를 선택하면 지도도 함께 보여주기 =
var mapOneContainer = document.getElementById('map1');

var mapContainer = document.getElementById('map2'), // 지도를 표시할 div
    mapOption = {
      center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
      level: 5 // 지도의 확대 레벨
    };

//지도를 미리 생성
var map = new daum.maps.Map(mapContainer, mapOption);
//주소-좌표 변환 객체를 생성
var geocoder = new daum.maps.services.Geocoder();
//마커를 미리 생성
var marker = new daum.maps.Marker({
  position: new daum.maps.LatLng(37.537187, 127.005476),
  map: map
});

function sample5_execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function(data) {
      var addr = data.address; // 최종 주소 변수

      // 주소 정보를 해당 필드에 넣는다.
      document.getElementById("sample5_address").value = addr;
      currentAddress.innerText = addr; // myLocation 안에 값 넣어주기
      
      addressArray = [];      // 검색 후 기존 주소 배열 초기화
      addressArray.push(addr);// 검색한 주소를 배열에 넣어주기

      // localStorage 기존 값 제거 후 검색한 값 넣어주기
      localStorage.removeItem('address');
      saveAddress(); // localStorage 에 저장

      
      // 주소로 상세 정보를 검색
      geocoder.addressSearch(data.address, function(results, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === daum.maps.services.Status.OK) {

          var result = results[0]; //첫번째 결과의 값을 활용

          // 해당 주소에 대한 좌표를 받아서
          var coords = new daum.maps.LatLng(result.y, result.x);
          // console.dir(coords);
          // console.dir(coords.La); // 경도
          // console.dir(coords.Ma); // 위도
          lngLatArray = [];            // 검색 후 기존 경도&위도 배열 초기화
          lngLatArray.push(coords.La); // lngLatArray 배열에 경도값 넣어주기
          lngLatArray.push(coords.Ma); // lngLatArray 배열에 위도값 넣어주기
          
          // localStorage 기존 값 제거 후 검색한 값 넣어주기
          localStorage.removeItem('longitude'); // 기존 경도값 없애기
          localStorage.removeItem('latitude');  // 기존 위도값 없애기
          saveLngLat();  // localStorage 에 저장


          // 지도를 보여준다.
          mapOneContainer.style.display = "none";
          mapContainer.style.display = "block";
          map.relayout();
          // 지도 중심을 변경한다.
          map.setCenter(coords);
          // 마커를 결과값으로 받은 위치로 옮긴다.
          marker.setPosition(coords)

          // 인포윈도우로 장소에 대한 설명을 표시합니다
          var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;color:black;">현재 위치 🚩</div>'
          });
        infowindow.open(map, marker);

        } // end of if -----
      }); // end of geocoder.addressSearch()
    }
  }).open();
} // end of sample5_execDaumPostcode() -----

