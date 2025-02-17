import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Scrollbar, A11y, Pagination } from 'swiper/modules';

const FlightMatrixCarousel = ({ flightmatrix, onestop, twostop, nonstop }) => {

  function searchForId(id, array, value) {
    for (const item of array) {
      if (item[value] === id) {
        return `${item.Currency} ${Number(item.Price).toLocaleString()}`;
      }
    }
    return ".....";
  }

  return (
    <>
    <style>{`
        .table-bordered {
          border: 1px solid #dee2e6 !important;
        }
        .table-bordered th, .table-bordered td {
          border: 1px solid #dee2e6 !important;
        }
       `}
       </style>

        <div className="table-responsive">
          <table className="table text-center table-bordered table-sm">
            <tbody>
              <tr>
                <th scope="col"></th>
                {flightmatrix && flightmatrix.map((d, k) => (
                  <td style={{ whiteSpace: "nowrap" }} key={k}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_AIRLINEIMAGE}/${d.code}.png`}
                      width={44}
                      height={44}
                      layout="intrinsic"
                      alt="Airline Logo"
                      className="me-1"
                      quality={100}
                      priority
                    />
                    <p className="text-capitalize small">{d.name}</p>
                  </td>
                ))}
              </tr>
              <tr>
                <th className="fw-bold" scope="col">NonStop</th>
                    {flightmatrix && flightmatrix.map((d, k) => (
                    <td className="fw-bold" style={{ whiteSpace: "nowrap" }} key={k}>
                        {searchForId(d.code, nonstop, 'AirlineCode')}
                    </td>
                    ))}
              </tr>
              <tr>
                <th className="fw-bold" scope="col">1 stop</th>
                    {flightmatrix && flightmatrix.map((d, k) => (
                    <td className="fw-bold" style={{ whiteSpace: "nowrap" }} key={k}>
                        {searchForId(d.code, onestop, 'AirlineCode')}
                    </td>
                    ))}
              </tr>
              <tr>
                <th className="fw-bold" scope="col">2+ stops</th>
                    {flightmatrix && flightmatrix.map((d, k) => (
                    <td className="fw-bold" style={{ whiteSpace: "nowrap" }} key={k}>
                        {searchForId(d.code, twostop, 'AirlineCode')}
                    </td>
                    ))}
              </tr>
            </tbody>
          </table>
        </div>
    </>
  );
};

export default FlightMatrixCarousel;