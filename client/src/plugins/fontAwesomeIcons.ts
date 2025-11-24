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

} from '@fortawesome/free-solid-svg-icons'

import {
    faUser,

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
)

export default library