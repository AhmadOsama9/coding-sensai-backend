const pool = require('../config/db');


const fetch_quizzes = async (related_id, related_type) => {
    const quizzes = await pool.query(`
      SELECT
      q.id AS quiz_id,
      q.title AS quiz_title,
      q.description AS quiz_description
      FROM
      quizzes q
      WHERE
      q.related_id = $1
      AND q.related_type = $2
    `, [related_id, related_type]);
  
    return quizzes.rows;
};


const fetch_quizzes_with_details = async (quiz_id) => {
    const result = await pool.query(`
      SELECT
        q.id AS quiz_id,
        q.title AS quiz_title,
        q.description AS quiz_description,
        qq.id AS question_id,
        qq.question_text AS question_text,
        qo.id AS option_id,
        qo.option_text AS option_text,
        qo.is_correct AS is_correct
      FROM
        quizzes q
      LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
      LEFT JOIN quiz_options qo ON qq.id = qo.question_id
      WHERE
        q.id = $1
    `, [quiz_id]);
  
    const quizzes_map = {};
  
    // Process the result rows to build the quizzes map
    result.rows.forEach(row => {
      if (!quizzes_map[row.quiz_id]) {
        quizzes_map[row.quiz_id] = {
          quiz_id: row.quiz_id,
          quiz_title: row.quiz_title,
          quiz_description: row.quiz_description,
          questions: {}
        };
      }
  
      if (!quizzes_map[row.quiz_id].questions[row.question_id]) {
        quizzes_map[row.quiz_id].questions[row.question_id] = {
          question_id: row.question_id,
          question_text: row.question_text,
          options: []
        };
      }
  
      quizzes_map[row.quiz_id].questions[row.question_id].options.push({
        option_id: row.option_id,
        option_text: row.option_text,
        is_correct: row.is_correct
      });
    });
  
    // Convert questions map to an array of questions
    const quizzes = Object.values(quizzes_map).map(quiz => ({
      ...quiz,
      questions: Object.values(quiz.questions)
    }));
  
    return quizzes;
  };
  

const get_random_questions_for_quiz = async (quiz_id, limit = 5) => {
    const result = await pool.query(`
      SELECT
        qq.id AS question_id,
        qq.question_text AS question_text
      FROM
        quiz_questions qq
      WHERE
        qq.quiz_id = $1
      ORDER BY RANDOM()  -- Randomize the result
      LIMIT $2            -- Limit to a specific number of questions
    `, [quiz_id, limit]);

    const questions_with_options = await Promise.all(
        result.rows.map(async (question) => {
            const options = await get_options_for_question(question.question_id);
            return {
                ...question,
                options,
            };
        })
    );

    return questions_with_options;
};

const get_options_for_question = async (question_id) => {
  const options = await pool.query(`
    SELECT
    qo.id AS option_id,
    qo.option_text AS option_text
    FROM
    quiz_options qo
    WHERE
    qo.question_id = $1
`, [question_id]);

return options.rows;
};


const fetch_quiz_questions = async (quiz_id) => {
  const result = await pool.query(`
      SELECT
          qq.id AS question_id,
          qq.question_text AS question_text,
          qo.id AS option_id,
          qo.option_text AS option_text,
          qo.is_correct AS is_correct
      FROM
          quiz_questions qq
      LEFT JOIN quiz_options qo ON qq.id = qo.question_id
      WHERE
          qq.quiz_id = $1
  `, [quiz_id]);

  const questions_map = {};

  // Process the result rows
  result.rows.forEach(row => {
      if (!questions_map[row.question_id]) {
          questions_map[row.question_id] = {
              question_id: row.question_id,
              question_text: row.question_text,
              options: []
          };
      }

      questions_map[row.question_id].options.push({
          option_id: row.option_id,
          option_text: row.option_text,
          is_correct: row.is_correct
      });
  });

  // Convert questions map to an array of questions
  return Object.values(questions_map);
};


module.exports = {
    fetch_quizzes,
    fetch_quizzes_with_details,
    get_random_questions_for_quiz,
    get_options_for_question,
    fetch_quiz_questions
};
