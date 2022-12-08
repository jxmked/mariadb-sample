
export default (str:string):string => {
    return String(str).normalize("NFD").trim();
}
