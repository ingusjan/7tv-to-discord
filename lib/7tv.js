import axios from "axios";

export const fetchAllEmotesFromSet = async (emoteSetId, emoteCountLimit) => {
  if (!emoteSetId) {
    throw new Error("Empty emote set ID provided");
  }

  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    Referer: "https://7tv.app/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  const data = {
    operationName: "GetEmoteSet",
    variables: {
      id: emoteSetId,
      formats: [],
    },
    query: `query GetEmoteSet($id: ObjectID!, $formats: [ImageFormat!]) {
      emoteSet(id: $id) {
        emotes {
          id
          name
          data {
            id
            name
            flags
            state
            lifecycle
            host {
              url
              files(formats: $formats) {
                name
                format
                __typename
              }
              __typename
            }
            owner {
              id
              display_name
              style {
                color
                __typename
              }
              roles
              __typename
            }
            __typename
          }
          __typename
        }
      }
    }`,
  };

  const emotes = await axios
    .post("https://7tv.io/v3/gql", data, { headers: headers })
    .then((res) => {
      const emotesArray = res.data.data.emoteSet.emotes.slice(
        0,
        emoteCountLimit || 0
      );

      // Create an array where it's only emotes and their names
      const emotes = emotesArray.map((emote) => {
        return {
          name: emote.name,
          id: emote.id,
          url: `https://cdn.7tv.app/emote/${emote.id}/2x.webp`,
        };
      });

      return emotes;
    })
    .catch((error) => {
      console.error(error);
    });

  return emotes;
};
