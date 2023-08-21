const { User, bookSchema } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookEntry }) => {
      // const user = await User.create({ username, email, password });
    const user = await User.findOneAndUpdate(
      { _id: context.user._id },
      { $addToSet: { savedBooks: bookEntry } },
      { runValidators: true, new: true }
    );
    const token = signToken(user);

      return { token, user };
    },
    removeBook: async (parent, bookId) => {
      // const user = await User.create({ username, email, password });
    const user = await User.findOneAndUpdate(
      { _id: context.user._id },
      { $pull: { savedBooks: { bookId: bookId } } },
      { runValidators: true, new: true }
    );
    const token = signToken(user);

      return { token, user };
    },
  },
};

module.exports = resolvers;
