import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(relativeTime).extend(customParseFormat);

export default dayjs;

export const BASE_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.000ZZ';
