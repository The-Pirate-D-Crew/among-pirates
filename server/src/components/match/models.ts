import mongoose from "mongoose";

// Match
interface Match {
	_id:mongoose.Types.ObjectId,
	invitationCode?:string,
	creationDate:Date,
}
const matchSchema = new mongoose.Schema<Match>({
	invitationCode: {type: String, index: true},
	creationDate: {type: Date, required: true, default: new Date()},
});
export const Match = mongoose.models.Match || mongoose.model<Match>("Match", matchSchema);

// Invitation
export interface Invitation {
	_id:mongoose.Types.ObjectId,
	code:string,
	creationDate:Date,
	match:mongoose.Schema.Types.ObjectId,
}
const invitationSchema = new mongoose.Schema<Invitation>({
	code: {type: String, index: true, required: true, unique: true},
	creationDate: {type: Date, required: true, default: new Date(), expires: "12h"},
	match: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Match'},
});
export const Invitation = mongoose.models.Invitation || mongoose.model<Invitation>("Invitation", invitationSchema);
