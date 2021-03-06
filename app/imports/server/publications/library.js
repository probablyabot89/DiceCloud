import Libraries from '/imports/api/library/Libraries.js';
import LibraryNodes from '/imports/api/library/LibraryNodes.js';

const standardLibraryIds = [
	'SRDLibraryGA3XWsd',
];

Meteor.publish('standardLibraries', function(){
	return Libraries.find({_id: {$in: standardLibraryIds}});
});

Meteor.publish('standardLibraryItems', function(categoryKey){
	return LibraryItems.find({
		library: {$in: standardLibraryIds},
		'settings.category': categoryKey,
	}, {
		sort: {name: 1},
	});
});

Meteor.publish('standardLibrarySpells', function(level){
	return LibrarySpells.find({
		library: {$in: standardLibraryIds},
		level,
	}, {
		sort: {name: 1},
	});
});

Meteor.publish('libraries', function(){
	const user = Meteor.user();
	const userId = user && user._id;
	if (!userId) return [];
	const subs = user && user.subscribedLibraries || [];
	return Libraries.find({
		$or: [
			{owner: userId},
			{writers: userId},
			{readers: userId},
			{_id: {$in: subs}},
		]
	});
});

Meteor.publish('library', function(libraryId){
	const user = Meteor.user();
	const userId = user && user._id;
	if (!userId) return [];
	const subs = user && user.subscribedLibraries || [];
	let libraryCursor = Libraries.find({
		_id: libraryId,
		$or: [
			{owner: userId},
			{writers: userId},
			{readers: userId},
			{_id: {$in: subs}},
		],
	});
	if (!libraryCursor.count()) return [];
	return [
		libraryCursor,
		LibraryNodes.find({
			'ancestors.id': libraryId,
		}),
	];
});
