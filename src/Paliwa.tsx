import { useCeny, formatDate } from "./UseCeny"
import "./main.css"
import { Icon } from "@iconify/react";

function Paliwa() {
  const { data, loading, error } = useCeny()

  if (loading) return <p>Ładowanie...</p>
  if (error)   return <p>Błąd</p>

  return (
    <>
 {/*   <p>{data?.hurt.pb95} zł/l</p>   
    <p>{data?.detal.pb95} zł/l</p>  
    <p>{data?.detal.on} zł/l</p>  
    <p>{data?.brent.price} </p>
    <p>{formatDate(data?.detal.updated ?? null)}</p>*/}

    <main>
        <h1>Ceny paliw na dzień {formatDate(data?.detal.updated ?? null)} </h1>
            <h3>Ceny Detaliczne Maxymalne oraz Hurtowe</h3>
        <div className="prices-detal">
            <div className="detal">
                <p>Benzyna 95</p>
                <span>
                    <p>Detal</p>
                    <p>{data?.detal.pb95}</p>
                    <p>zł/L</p>
                </span>
                <span>
                    <p>Hurt</p>
                    <p>{data?.hurt.pb95}</p>
                    <p>orlen/L</p>
                </span>
                <span>
                    <p>Data</p>
                    <p>{formatDate(data?.detal.updated ?? null)}</p>
                    
                </span>
            </div>
            <div className="detal">
                                <p>Benzyna 98</p>
                <span>
                    <p>Detal</p>
                    <p>{data?.detal.pb98}</p>
                    <p>zł/L</p>
                </span>
                <span>
                    <p>Hurt</p>
                    <p>{data?.hurt.pb98}</p>
                    <p>orlen/L</p>
                </span>
                <span>
                    <p>Data</p>

                    <p>{formatDate(data?.detal.updated ?? null)}</p>
                </span>
            </div>
            <div className="detal">
                                <p>Olej napędowy</p>
                <span>
                    <p>Detal</p>
                    <p>{data?.detal.on}</p>
                    <p>zł/L</p>
                </span>
                <span>
                    <p>Hurt</p>
                    <p>{data?.hurt.on}</p>
                    <p>orlen/L</p>
                </span>
                <span>
                    <p>Data</p>
                    <p>{formatDate(data?.detal.updated ?? null)}</p>
                </span>
            </div>
            
            
        </div>

    </main>
    </>
  )
}
export default Paliwa