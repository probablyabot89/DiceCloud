import SimpleSchema from 'simpl-schema';

let Parties = new Mongo.Collection("parties");

let partySchema = new SimpleSchema({
	name: {
		type: String,
		defaultValue: "New Party",
		trim: false,
		optional: true,
	},
	characters: {
		type: Array,
		defaultValue: [],
	},
	characters: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		index: 1,
	},
	owner: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
	},
});

Parties.attachSchema(partySchema);

Parties.allow({
	insert: function(userId, doc) {
		return userId && doc.owner === userId;
	},
	update: function(userId, doc, fields, modifier) {
		return userId && doc.owner === userId;
	},
	remove: function(userId, doc) {
		return userId && doc.owner === userId;
	},
	fetch: ["owner"],
});

Parties.deny({
	update: function(userId, docs, fields, modifier) {
		// can't change owners
		return _.contains(fields, "owner");
	}
});

export default Parties;
