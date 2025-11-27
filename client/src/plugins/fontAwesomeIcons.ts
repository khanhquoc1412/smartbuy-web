import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faUserSecret,
    faAngleRight,
    faCalendar,
    faAngleLeft,
    faHeadset,
    faCartPlus,
    faClock,
    faStar,
    faMobile,
    faLaptop,
    faCalendarDays,
    faPenToSquare,  // ✅ THÊM import
    faTrashCan,      // ✅ THÊM import
    faCircleCheck,   // ✅ THÊM import
    faHeart,         // ✅ THÊM heart icon (solid)

} from '@fortawesome/free-solid-svg-icons'

import {
    faUser,
    faHeart as faHeartRegular,  // ✅ THÊM heart icon (regular)

} from '@fortawesome/free-regular-svg-icons'

library.add(faUserSecret,
    faAngleRight,
    faAngleLeft,
    faHeadset,
    faCalendar,
    faCartPlus,
    faUser,
    faClock,
    faStar,
    faMobile,
    faLaptop,
    faUser,
    faPenToSquare,  // ✅ Thêm vào library
    faTrashCan,     // ✅ Thêm vào library
    faCircleCheck,  // ✅ Thêm vào library
    faHeart,          // ✅ Thêm heart solid
    faHeartRegular,   // ✅ Thêm heart regular
)

export default library