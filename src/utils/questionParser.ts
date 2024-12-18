import * as XLSX from 'xlsx';

export const parseQuestionFile = async (file: File): Promise<any[]> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'json') {
    return parseJsonFile(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcelFile(file);
  } else if (extension === 'csv') {
    return parseCsvFile(file);
  }
  
  throw new Error('فرمت فایل پشتیبانی نمی‌شود');
};

const parseJsonFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const questions = JSON.parse(e.target?.result as string);
        resolve(validateQuestions(questions));
      } catch (error) {
        reject(new Error('خطا در پردازش فایل JSON'));
      }
    };
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'));
    reader.readAsText(file);
  });
};

const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const questions = XLSX.utils.sheet_to_json(worksheet);
        resolve(validateQuestions(questions));
      } catch (error) {
        reject(new Error('خطا در پردازش فایل Excel'));
      }
    };
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'));
    reader.readAsBinaryString(file);
  });
};

const parseCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        const questions = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj: any, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });
        
        resolve(validateQuestions(questions));
      } catch (error) {
        reject(new Error('خطا در پردازش فایل CSV'));
      }
    };
    reader.onerror = () => reject(new Error('خطا در خواندن فایل'));
    reader.readAsText(file);
  });
};

const validateQuestions = (questions: any[]): any[] => {
  return questions.filter(q => {
    return (
      q.question_text &&
      q.difficulty_level &&
      Array.isArray(q.options) &&
      q.options.length > 0
    );
  });
};