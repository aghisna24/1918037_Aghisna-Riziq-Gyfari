

const ApiKey ="68c59b6067744425bdcb2a26c57c3beb";
const baseUrl ="https://api.football-data.org/v2/";
const leagueId ="2021";
const baseEndPoint =`${baseUrl}competitions/${leagueId}`;
const teamEndPoint =`${baseUrl}competitions/${leagueId}/teams`;
const standingsEndPoint =`${baseUrl}competitions/${leagueId}/standings`;
const matchesEndPoint =`${baseUrl}competitions/${leagueId}/matches`;

const contents = document.querySelector("#content-list");
const title = document.querySelector(".card-title");
const fetchHeader = {
    headers:{
        'X-Auth-Token': ApiKey
    }
};



function getListTeams(){
    title.innerHTML="Daftar Tim Liga Premier Inggris";
    fetch(teamEndPoint,fetchHeader)
    .then(response => response.json())
    .then(resJson=>{
        console.log(resJson);
        let teams="";
        resJson.teams.forEach(team=>{
            teams +=`
            <li class="collection-item avatar">
                <img src="${team.crestUrl}" alt="" class="circle">
                <span class="title">${team.name}</span>
                <p> Berdiri: ${team.founded} <br>
                    Stadion: ${team.venue}
                </p>
                <a href="#" data-target="modal1" class=" modal-trigger secondary-content">
                <i class="material-icons" data-id="${team.id}">info</i>
                <a>
            </li>
            `
        });
        contents.innerHTML ='<ul class="collection">' +teams+ '</ul>';
        const detil = document.querySelectorAll('.secondary-content');
        detil.forEach(btn=>{
            btn.onclick=(event)=>{
               showTeamInfo(event.target.dataset.id);
            }
        })
    }).catch(err =>{
        console.error(err);
    })
}

function showTeamInfo(id){
    let url = baseUrl + "teams/" + id;
    fetch(url,fetchHeader)
    .then(response => response.json())
    .then(detail=>{
        let details =`

                <div class="row">
                <div class="col s8">
                    <p> Nama Tim : ${detail.name}</p>
                    <p> Alamat Tim : ${detail.address}</p>
                    <p> Nomor Telpon : ${detail.phone}</p>
                    <p> Alamat Website : ${detail.website}</p>
                    <p> Email : ${detail.email}</p>
                </div>
                <div class="col s4">
                    <img src="${detail.crestUrl}" alt="${detail.name}" width="280px">
                </div>
                </div>


        `;
        document.getElementById("showmodal").innerHTML = details;
    })
}


function getListStandings(){
    title.innerHTML="Klasemen Sementara Liga Premier Inggris";
    fetch(standingsEndPoint,fetchHeader)
    .then(response => response.json())
    .then(resJson=>{
        console.log(resJson.standings[0]);
        let teams="";
        let i=1;
        resJson.standings[0].table.forEach(team=>{
            teams +=`
            <tr>
            <td style="padding-left:20px;">${i}.</td>
                <td><img src="${team.team.crestUrl}" alt="${team.team.name}" width="30px"></td>
                <td>${team.team.name}</td>
                <td>${team.playedGames}</td>
                <td>${team.won}</td>
                <td>${team.draw}</td>
                <td>${team.lost}</td>
                <td>${team.points}</td>
            </tr>
            `;
            i++;
        });
        contents.innerHTML =`
            <div class="card">
                <table class = "stripped responsive-table">
                    <thead>
                        <th></th>
                        <th></th>
                        <th>Nama Tim</th>
                        <th>PG</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>P</th>
                    </thead>
                    <tbody>
                        ${teams}
                    </tbody>
                </table>
            </div>
            `
    }).catch(err =>{
        console.error(err);
    })
}

function getListMatches(){
    title.innerHTML="Jadwa Pertandingan Liga Premier Inggris";
    fetch(matchesEndPoint,fetchHeader)
    .then(response => response.json())
    .then(resJson=>{
        console.log(resJson.matches);
        let matchs="";
        let i=1;
        resJson.matches.forEach(match=>{
            let d= new Date(match.utcDate).toLocaleDateString("id");
            let scoreHomeTeam = (match.score.fullTime.homeTeam ==null?0:match.score.fullTime.homeTeam);
            let scoreAwayTeam = (match.score.fullTime.awayTeam ==null?0:match.score.fullTime.awayTeam);
            matchs +=`
            <tr>
            <td style="padding-left:20px;">${i}.</td>
                <td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
                <td>${d}</td>
                <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
            </tr>
            `;
            i++;
        });
        contents.innerHTML =`
            <div class="card">
                <table class = "stripped responsive-table">
                    <thead>
                        <th></th>
                        <th>Peserta</th>
                        <th>Tanggal</th>
                        <th>Skor Akhir</th>
                    </thead>
                    <tbody>
                        ${matchs}
                    </tbody>
                </table>
            </div>
            `
    }).catch(err =>{
        console.error(err);
    })
}


function loadPage(page){
    switch(page){
        case "teams":
            getListTeams();
            break;
        case "standings":
            getListStandings();
            break;
        case "matches":
            getListMatches();
            break;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    document.querySelectorAll(".sidenav a, .topnav a").forEach(elm=>{
        elm.addEventListener("click", evt=>{
            let sideNav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sideNav).close();
            page = evt.target.getAttribute("href").substr(1);
            loadPage(page);
        })
    })
    var page = window.location.hash.substr(1);
    if(page===""||page==="!" ) page ="teams";
    loadPage(page)
  });