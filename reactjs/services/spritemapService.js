export const Type = {
  Simple: 1,
  JSON: 2,
  XML: 3
}

export function getExtension(type) {
  if(type == Type.JSON)
    return 'json'
  else if(type == Type.XML)
    return 'xml'
  else
    return 'txt'
}
