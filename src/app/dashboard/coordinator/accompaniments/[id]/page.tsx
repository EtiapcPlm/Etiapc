import { AccompanimentClient } from "./AccompanimentClient";
import axios from "axios";
import { IAccompaniment } from "@/models/Accompaniment";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AccompanimentPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const response = await axios.get(`/api/accompaniments/${id}`);
    const accompaniment = response.data as IAccompaniment;
    
    return <AccompanimentClient initialAccompaniment={accompaniment} id={id} />;
  } catch (error) {
    return <div>Error al cargar el acompañamiento</div>;
  }
} 
