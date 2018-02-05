import { createSelector } from 'reselect'

const userSelector = state => state.user.user
const courseSelector = (state, props) => state.courses.courses[props.courseId]
const courseIdForQueueSelector = (state, props) => {
  const queue = state.queues.queues[props.queueId]
  return queue ? queue.courseId : null
}
const queueSelector = (state, props) => state.queues.queues[props.queueId]
const activeStaffSelector = state => state.activeStaff.activeStaff

export const getActiveStaff = createSelector([
  queueSelector,
  activeStaffSelector,
], (queue, activeStaff) => {
  if (!queue) {
    return []
  }
  return queue.activeStaff.map(activeStaffId => activeStaff[activeStaffId].user)
})

export const isUserActiveStaffForQueue = createSelector([
  queueSelector,
  activeStaffSelector,
  userSelector,
], (queue, activeStaff, user) => {
  if (!queue || !queue.activeStaff) {
    return false
  }
  const idx = queue.activeStaff.findIndex(asId => activeStaff[asId].user === user.id)
  return idx !== -1
})

export const isUserCourseStaff = createSelector([
  userSelector,
  courseIdForQueueSelector,
], (user, courseId) => {
  try {
    // Blindly assume we can walk deep into objects, and fail if we can't
    // access any required properties
    // eslint-disable-next-line prefer-destructuring
    return user.staffAssignments.indexOf(courseId) !== -1
  } catch (e) {
    return false
  }
})

export const NULL = 'NULL'