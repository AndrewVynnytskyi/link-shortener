

export default function LinkCard({originalLink, shortenLink} : {originalLink: string, shortenLink:string}){

    return(<div>
        <h4>{shortenLink}</h4>
        <p>{originalLink}</p>
    </div>)
}