import * as React from "react";
import Modal, { closeModal } from "./index";
import Logger from "handlers/Logger";
import AlertMessage from "../AlertMessage";
import { useRouter } from "next/router";
import Guild from "types/Guild";

interface Props {
  guild: Guild;
  slash?: boolean;
}

const CreateCommandModal: React.FC<Props> = ({ guild, slash }: Props) => {
  const [name, setName] = React.useState("");
  const [cmdRes, setCmdRes] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [response, setResponse] = React.useState<{ error: string } | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env["NEXT_PUBLIC_DASHBOARD_URL"]}/api/guilds/${guild.id}/${
          slash ? "slash-" : ""
        }commands`,
        {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
            response: cmdRes,
          }),
        },
      );
      const data = await res.json();

      if (data.status === "success") {
        closeModal("createCommandModal");
        setName("");
        setCmdRes("");
        setDescription("");
        setResponse(null);
        router.push(
          `/dashboard/${guild.id}/${
            slash ? "slash-" : ""
          }commands?message=Successfully Added command`,
        );
      }

      setResponse(data);
    } catch (e) {
      Logger.error("create_Command", e);
    }
  }

  return (
    <Modal id="createCommandModal" title="Create command">
      {response?.error ? <AlertMessage message={response?.error} /> : null}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Command name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>
        {slash ? (
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Command Description
            </label>
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>
        ) : null}
        <div className="form-group">
          <label className="form-label" htmlFor="response">
            Command response
          </label>
          <textarea
            id="response"
            value={cmdRes}
            onChange={(e) => setCmdRes(e.target.value)}
            className="form-input"
            maxLength={1800}
          />
        </div>
        <div className="float-right">
          <button className="btn btn-primary" type="submit">
            Add command
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCommandModal;
