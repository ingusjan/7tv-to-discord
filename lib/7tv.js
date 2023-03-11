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
        name
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

  const res = await axios
    .post("https://7tv.io/v3/gql", data, { headers: headers })
    .then((res) => {
      const emotesArray = res.data.data.emoteSet.emotes.slice(
        0,
        emoteCountLimit || 9999
      );

      const emoteSetName = res.data.data.emoteSet.name;

      // Create an array where it's only emotes and their names
      const emotes = emotesArray.map((emote) => {
        return {
          name: emote.name,
          id: emote.id,
          url: `https://cdn.7tv.app/emote/${emote.id}/`,
        };
      });

      return { emotes: emotes, emoteSetName: emoteSetName };
    })
    .catch((error) => {
      console.error(error);
    });

  return { emotes: res.emotes, emoteSetName: res.emoteSetName };
};

export const fetchSingularEmote = async (emoteId) => {
  if (!emoteId) {
    throw new Error("Empty emote ID provided");
  }

  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    Referer: "https://7tv.app/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  const data = {
    operationName: "Emote",
    variables: {
      id: emoteId,
    },
    query:
      "query Emote($id: ObjectID!) {\n  emote(id: $id) {\n    id\n    created_at\n    name\n    lifecycle\n    state\n    trending\n    tags\n    owner {\n      id\n      username\n      display_name\n      avatar_url\n      style {\n        color\n        paint_id\n        __typename\n      }\n      __typename\n    }\n    flags\n    host {\n      ...HostFragment\n      __typename\n    }\n    versions {\n      id\n      name\n      description\n      created_at\n      lifecycle\n      state\n      host {\n        ...HostFragment\n        __typename\n      }\n      __typename\n    }\n    animated\n    __typename\n  }\n}\n\nfragment HostFragment on ImageHost {\n  url\n  files {\n    name\n    format\n    width\n    height\n    size\n    __typename\n  }\n  __typename\n}",
  };

  const emote = await axios
    .post("https://7tv.io/v3/gql", data, { headers: headers })
    .then((res) => {
      const { name, id } = res.data.data.emote;
      return { name, id, url: `https://cdn.7tv.app/emote/${id}/` };
    })
    .catch((error) => {
      console.error(error);
    });

  return emote;
};
