export default class Utils {
    static getValueFromString(s) {
        const arr = s.split(':');
        return arr[1].trim();
    }

    static dateToString(date): string {
        return (date.getDate() < 10
            ? '0' + date.getDate()
            : '' + date.getDate()) + '/'
            + (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '/' + date.getFullYear();
    }

    static convertToNgbDatepickerFormat(dateString) {
        if (!dateString) {
            return {};
        }
        const parts = (dateString as string).split('/');
        return { year: parseInt(parts[2], 10), month: parseInt(parts[1], 10), day: parseInt(parts[0], 10) };
    }

    static createDate(year, month, day): Date {
        return new Date(year, month - 1, day);
    }
}
