const pool = require("../config/db");
const {
    fetch_quizzes,
  } = require("./quizzes_repository");

const get_milestones_for_topic_no_user = async (topic_id) => {
  const milestones = await pool.query(`
    SELECT
    m.id AS milestone_id,
    m.title AS milestone_title,
    m.description AS milestone_description
    FROM
    milestones m
    WHERE
    m.topic_id = $1
`, [topic_id]);

  const milestoneDetails = await Promise.all(milestones.rows.map(async (milestone) => {
    const quiz = await fetch_quizzes(milestone.milestone_id, 'milestone');
    return {
    ...milestone,
    quiz
    };
}));

return milestoneDetails;
};

const get_common_mistakes_for_topic_no_user = async (topic_id) => {
  const commonMistakes = await pool.query(`
    SELECT
    cm.id AS mistake_id,
    cm.title AS mistake_title,
    cm.description AS mistake_description
    FROM
    common_mistakes cm
    WHERE
    cm.topic_id = $1
`, [topic_id]);

  const commonMistakeDetails = await Promise.all(commonMistakes.rows.map(async (mistake) => {
    const quiz = await fetch_quizzes(mistake.mistake_id, 'common_mistake');
    return {
    ...mistake,
    quiz
    };
}));

return commonMistakeDetails;
};

const get_code_examples_for_topic_no_user = async (topic_id) => {
  const codeExamples = await pool.query(`
    SELECT
    ce.id AS example_id,
    ce.title AS example_title
    FROM
    code_examples ce
    WHERE
    ce.topic_id = $1
`, [topic_id]);

return codeExamples.rows;
}

const get_code_examples_for_topic = async (topic_id) => {
  const codeExamples = await pool.query(`
    SELECT
    ce.id AS example_id,
    ce.title AS example_title
    FROM
    code_examples ce
    WHERE
    ce.topic_id = $1
`, [topic_id]);

  return codeExamples.rows;
};


// Fetch milestones for a topic and include user completion data
const get_milestones_for_topic = async (topic_id, user_id) => {
  const milestones = await pool.query(`
    SELECT
      m.id AS milestone_id,
      m.title AS milestone_title,
      m.description AS milestone_description,
      m.video_url,  -- Include video_url if necessary
      m.img_url,    -- Include img_url if necessary
      COALESCE(umc.completed, false) AS user_complete -- Use user-specific completed status, default to false if no record exists
    FROM
      milestones m
    LEFT JOIN user_milestone_completions umc 
      ON umc.milestone_id = m.id 
      AND umc.user_id = $2
    WHERE
      m.topic_id = $1
  `, [topic_id, user_id]);

  // Get quizzes for each milestone
  const milestoneDetails = await Promise.all(milestones.rows.map(async (milestone) => {
    const quiz = await fetch_quizzes(milestone.milestone_id, 'milestone');
    return {
      ...milestone,
      quiz
    };
  }));

  return milestoneDetails;
};


const get_assignment_for_topic = async (topic_id, user_id) => {
  const result = await pool.query(`
    SELECT
        a.id as assignment_id,
        a.title as assignment_title,
        a.description as assignment_description,
        COALESCE(uac.completed, FALSE) as completed
    FROM assignments a
    LEFT JOIN user_assignment_completions uac ON a.id = uac.assignment_id AND uac.user_id = $2
    WHERE a.topic_id = $1
  `, [topic_id, user_id]);

  if (result.rows.length === 0) {
      // throw new Error("Assignment not found.");
      return null;
  }

  return result.rows[0];
};


const get_common_mistakes_for_topic = async (topic_id, user_id) => {
  const commonMistakes = await pool.query(`
    SELECT
      cm.id AS mistake_id,
      cm.title AS mistake_title,
      cm.description AS mistake_description,
      cm.content,  -- Include content as requested
      cm.video_url, -- Include video_url if necessary
      COALESCE(ucmc.completed, false) AS user_complete -- Use user-specific completed status, default to false if no record exists
    FROM
      common_mistakes cm
    LEFT JOIN user_common_mistake_completions ucmc 
      ON ucmc.common_mistake_id = cm.id 
      AND ucmc.user_id = $2
    WHERE
      cm.topic_id = $1
  `, [topic_id, user_id]);

  // Get quizzes for each common mistake
  const commonMistakeDetails = await Promise.all(commonMistakes.rows.map(async (mistake) => {
    const quiz = await fetch_quizzes(mistake.mistake_id, 'common_mistake');
    return {
      ...mistake,
      quiz
    };
  }));

  return commonMistakeDetails;
};


module.exports = {
    get_milestones_for_topic_no_user,
    get_common_mistakes_for_topic_no_user,
    get_code_examples_for_topic_no_user,
    get_code_examples_for_topic,
    get_milestones_for_topic,
    get_assignment_for_topic,
    get_common_mistakes_for_topic
};