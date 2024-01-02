import fetch from "node-fetch";
import * as cheerio from "cheerio";

export const getAuth = async () => {
  const res = await fetch("https://grapp.spravazeleznic.cz/");
  const html = await res.text();

  const $ = cheerio.load(html);
  const token = $("#token").attr("value");

  const sessionIdCookie = res.headers.get("Set-Cookie").split("; ")[0];
  return { token, sessionIdCookie };
};

export const getAllTrains = async (token, sessionIdCookie) => {
  const res = await fetch(
    "https://grapp.spravazeleznic.cz/post/trains/GetTrainsWithFilter/" + token,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: sessionIdCookie,
      },
      body: JSON.stringify({
        CarrierCode: [
          "991919",
          "992230",
          "992719",
          "993030",
          "990010",
          "993188",
          "991943",
          "993246",
          "991950",
          "993196",
          "992693",
          "991638",
          "991976",
          "993089",
          "993162",
          "991257",
          "991935",
          "991562",
          "991125",
          "992644",
          "992842",
          "991927",
          "993170",
          "991810",
          "992909",
          "991612",
          "f_o_r_e_i_g_n",
        ],
        PublicKindOfTrain: [
          "LE",
          "Ex",
          "Sp",
          "rj",
          "TL",
          "EC",
          "SC",
          "AEx",
          "Os",
          "Rx",
          "TLX",
          "IC",
          "EN",
          "R",
          "RJ",
          "NJ",
          "LET",
          "ES",
        ],
        FreightKindOfTrain: [],
        KindOfExtraordinary: [],
        TrainRunning: false,
        PMD: false,
        TrainNoChange: 0,
        TrainOutOfOrder: false,
        Delay: ["0", "60", "5", "61", "15", "-1", "30"],
        DelayMin: -99999,
        DelayMax: -99999,
        SearchByTrainNumber: true,
        SearchByTrainName: true,
        SearchByTRID: false,
        SearchByVehicleNumber: false,
        SearchTextType: "0",
        SearchPhrase: "",
        SelectedTrain: -1,
      }),
    }
  );
  const data = await res.json();
  const allTrains = data.Trains.map((train) => ({
    id: train.Id,
    name: train.Title.replace(/\D/g, ""),
  }));
  return allTrains;
};
